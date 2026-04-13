from typing import Literal
from enum import StrEnum
import pydantic
import strawberry
from backend.shared.key import Key


"""Pydantic Models"""


class RoomType(StrEnum):
    LECTURE = "lecture"
    OFFICE = "office"
    LABORATORY = "laboratory"
    AUDITORIUM = "auditorium"
    OTHER = "other"


class RoomBase(pydantic.BaseModel):
    name: str
    room_type: RoomType
    capacity: int
    power_outlet: float
    building_key: Key[Literal["Building"]]


class RoomCreate(RoomBase):
    pass


class RoomResponse(RoomBase):
    key: Key[Literal["Room"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=RoomResponse, all_fields=True)
class RoomModel:
    key: strawberry.ID
    building_key: strawberry.ID


@strawberry.experimental.pydantic.input(model=RoomCreate, all_fields=True)
class RoomInput:
    building_key: strawberry.ID
