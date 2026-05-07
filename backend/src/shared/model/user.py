from enum import StrEnum
from typing import Literal

import pydantic
import strawberry

from shared.key import Key


@strawberry.enum
class UserType(StrEnum):
    ADMIN = "admin"
    STANDARD = "standard"
    SPECTATE = "spectate"


class UserCreate(pydantic.BaseModel):
    person_key: Key[Literal["Person"]] | None = None
    email: str
    password_hash: str
    type: UserType = UserType.STANDARD


class UserResponse(UserCreate):
    key: Key[Literal["User"]]


class UserPublic(pydantic.BaseModel):
    key: Key[Literal["User"]]
    person_key: Key[Literal["Person"]] | None = None
    email: str
    type: UserType


@strawberry.experimental.pydantic.type(model=UserPublic, all_fields=True)
class UserModel:
    key: strawberry.ID
    person_key: strawberry.ID | None
