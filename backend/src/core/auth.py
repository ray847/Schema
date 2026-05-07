import sqlite3
import secrets
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, status
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from settings import settings
from shared.model import UserPublic, UserResponse, UserType


password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummy-password")
JWT_SECRET_KEY = secrets.token_urlsafe(32)


@contextmanager
def _connect() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(
        settings.db_filepath,
        detect_types=sqlite3.PARSE_DECLTYPES,
        timeout=30,
    )
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA busy_timeout = 30000;")
    try:
        yield conn
    finally:
        conn.close()


def _user_response_from_row(row: sqlite3.Row) -> UserResponse:
    return UserResponse(
        key=row["key"],
        person_key=row["person_key"],
        email=row["email"],
        password_hash=row["password_hash"],
        type=UserType(row["type"]),
    )


def public_user(user: UserResponse) -> UserPublic:
    return UserPublic(
        key=user.key,
        person_key=user.person_key,
        email=user.email,
        type=user.type,
    )


def get_password_hash(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def get_user_by_email(email: str) -> UserResponse | None:
    with _connect() as conn:
        row = conn.execute(
            """
SELECT key, person_key, email, password_hash, type
FROM user
WHERE email = ?
""",
            (email,),
        ).fetchone()
    return _user_response_from_row(row) if row else None


def get_user_by_key(user_key: int) -> UserResponse | None:
    with _connect() as conn:
        row = conn.execute(
            """
SELECT key, person_key, email, password_hash, type
FROM user
WHERE key = ?
""",
            (user_key,),
        ).fetchone()
    return _user_response_from_row(row) if row else None


def register_user(email: str, password: str) -> UserPublic:
    hashed_password = get_password_hash(password)

    with _connect() as conn:
        try:
            conn.execute("BEGIN IMMEDIATE;")
            has_users = conn.execute(
                "SELECT EXISTS(SELECT 1 FROM user LIMIT 1)"
            ).fetchone()[0]
            user_type = UserType.STANDARD if has_users else UserType.ADMIN
            cursor = conn.execute(
                """
INSERT INTO user (email, password_hash, type)
VALUES (?, ?, ?)
""",
                (email, hashed_password, user_type.value),
            )
            row = conn.execute(
                """
SELECT key, person_key, email, password_hash, type
FROM user
WHERE key = ?
""",
                (cursor.lastrowid,),
            ).fetchone()
            conn.commit()
        except sqlite3.IntegrityError as error:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User email is already registered",
            ) from error

    return public_user(_user_response_from_row(row))


def authenticate_user(email: str, password: str) -> UserResponse | None:
    user = get_user_by_email(email)
    if user is None:
        verify_password(password, DUMMY_HASH)
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def create_access_token(user: UserResponse) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": str(user.key), "exp": expire}
    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=settings.algorithm,
    )


def credentials_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def user_from_token(token: str) -> UserPublic:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[settings.algorithm],
        )
        subject = payload.get("sub")
        if subject is None:
            raise credentials_exception()
        user_key = int(subject)
    except (InvalidTokenError, ValueError) as error:
        raise credentials_exception() from error

    user = get_user_by_key(user_key)
    if user is None:
        raise credentials_exception()
    return public_user(user)


def user_from_authorization_header(
    authorization: str | None,
) -> UserPublic | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    try:
        return user_from_token(token)
    except HTTPException:
        return None
