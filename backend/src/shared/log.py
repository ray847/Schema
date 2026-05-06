import datetime
import pathlib
from typing import Any

from settings import settings


DEFAULT_LOG_FILENAME = "database.log"


def _format_value(value: Any) -> str:
    if isinstance(value, str):
        value = " ".join(value.split())
    return repr(value)


def log(operation: str, message: str, **fields: Any) -> None:
    """Append a database log entry to the configured log directory."""
    log_dir = pathlib.Path(settings.log_dir)
    log_dir.mkdir(parents=True, exist_ok=True)
    log_path = log_dir / DEFAULT_LOG_FILENAME

    timestamp = datetime.datetime.now().isoformat(timespec="seconds")
    field_text = " ".join(
        f"{key}={_format_value(value)}" for key, value in fields.items()
    )
    suffix = f" {field_text}" if field_text else ""

    with log_path.open("a", encoding="utf-8") as file:
        file.write(f"{timestamp} [{operation.upper()}] {message}{suffix}\n")


__all__ = ["log"]
