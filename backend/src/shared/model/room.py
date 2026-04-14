from typing import Literal, TYPE_CHECKING, Annotated
from enum import StrEnum
import pydantic
import strawberry
from strawberry.scalars import JSON
from shared.key import Key
from .facility import Facility

if TYPE_CHECKING:
    from .building import BuildingModel


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
    facility: Facility
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
    facility: JSON

    @strawberry.field
    async def building(
        self, info: strawberry.Info
    ) -> Annotated["BuildingModel", strawberry.lazy(".building")]:
        from .building import BuildingModel

        res = await info.context.data_loader.building.load(self.building_key)
        return BuildingModel(
            key=res["key"],
            name=res["name"],
            building_type=res["building_type"],
            location=res["location"],
            campus_key=res["campus_key"],
        )


@strawberry.experimental.pydantic.input(model=RoomCreate, all_fields=True)
class RoomInput:
    building_key: strawberry.ID
    facility: JSON
