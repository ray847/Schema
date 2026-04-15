import datetime
from typing import Literal, TYPE_CHECKING, Annotated
from enum import StrEnum
import pydantic
import strawberry
from shared.key import Key

if TYPE_CHECKING:
    from .room import RoomModel


@strawberry.enum
class EventType(StrEnum):
    COURSE = "Course"
    ACTIVITY = "Activity"


"""Pydantic Models"""


class AllocationBase(pydantic.BaseModel):
    room_key: Key[Literal["Room"]]
    event_type: EventType
    event_key: int
    start_time: datetime.datetime
    end_time: datetime.datetime


class AllocationCreate(AllocationBase):
    pass


class AllocationResponse(AllocationBase):
    key: Key[Literal["Allocation"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=AllocationResponse, all_fields=True)
class AllocationModel:
    key: strawberry.ID
    room_key: strawberry.ID

    @strawberry.field
    async def room(
        self, info: strawberry.Info
    ) -> Annotated["RoomModel", strawberry.lazy(".room")]:
        from .room import RoomModel
        import json

        res = await info.context.data_loader.room.load(self.room_key)
        return RoomModel(
            key=res["key"],
            name=res["name"],
            room_type=res["room_type"],
            capacity=res["capacity"],
            facility=json.loads(res["facility"]),
            building_key=res["building_key"],
        )


@strawberry.experimental.pydantic.input(
    model=AllocationCreate, all_fields=True
)
class AllocationInput:
    room_key: strawberry.ID
