import json
import os
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections.abc import Iterator
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[1]
BACKEND_SRC = ROOT / "backend" / "src"
DB_FILE = BACKEND_SRC / "db_file.db"


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def _request(
    base_url: str,
    path: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    body: bytes | None = None,
) -> tuple[int, dict]:
    request = urllib.request.Request(
        f"{base_url}{path}",
        data=body,
        headers=headers or {},
        method=method,
    )
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            payload = response.read()
            return response.status, json.loads(payload or b"{}")
    except urllib.error.HTTPError as error:
        payload = error.read()
        try:
            parsed = json.loads(payload or b"{}")
        except json.JSONDecodeError:
            parsed = {"detail": payload.decode("utf-8", errors="replace")}
        return error.code, parsed


@pytest.fixture(scope="session")
def backend_url() -> Iterator[str]:
    if DB_FILE.exists():
        DB_FILE.unlink()

    port = _free_port()
    env = os.environ.copy()
    env["PYTHONPATH"] = str(BACKEND_SRC)
    process = subprocess.Popen(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "main:app",
            "--host",
            "127.0.0.1",
            "--port",
            str(port),
        ],
        cwd=BACKEND_SRC,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    base_url = f"http://127.0.0.1:{port}"
    deadline = time.time() + 30
    try:
        while time.time() < deadline:
            if process.poll() is not None:
                output = process.stdout.read() if process.stdout else ""
                raise RuntimeError(f"Backend exited early:\n{output}")
            try:
                status, _ = _request(base_url, "/health")
                if status == 200:
                    break
            except OSError:
                pass
            time.sleep(0.25)
        else:
            output = process.stdout.read() if process.stdout else ""
            raise RuntimeError(f"Backend did not start in time:\n{output}")

        yield base_url
    finally:
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=10)


@pytest.fixture(scope="session")
def api(backend_url: str):
    return ApiClient(backend_url)


class ApiClient:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url

    def register(self, email: str, password: str) -> dict:
        status, body = _request(
            self.base_url,
            "/auth/register",
            method="POST",
            headers={"Content-Type": "application/json"},
            body=json.dumps({"email": email, "password": password}).encode(),
        )
        assert status == 200, body
        return body

    def token(self, email: str, password: str) -> str:
        form = urllib.parse.urlencode(
            {"username": email, "password": password}
        ).encode()
        status, body = _request(
            self.base_url,
            "/auth/token",
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            body=form,
        )
        assert status == 200, body
        assert body["token_type"] == "bearer"
        return body["access_token"]

    def me(self, token: str) -> dict:
        status, body = _request(
            self.base_url,
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert status == 200, body
        return body

    def graphql(self, query: str, variables: dict | None = None, token: str | None = None) -> dict:
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        status, body = _request(
            self.base_url,
            "/graphql",
            method="POST",
            headers=headers,
            body=json.dumps({"query": query, "variables": variables or {}}).encode(),
        )
        assert status == 200, body
        assert "errors" not in body, body
        return body["data"]
