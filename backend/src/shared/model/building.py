from typing import Literal, TYPE_CHECKING, Annotated
from enum import StrEnum
import pydantic
import strawberry
from shared.key import Key

if TYPE_CHECKING:
    from .campus import CampusModel
    from .room import RoomModel
    from .building_metadata import BuildingMetadataModel


"""Pydantic Models"""


class BuildingType(StrEnum):
    ACADEMIC = "academic"
    CAFETERIA = "cafeteria"
    LIBRARY = "library"
    OTHER = "other"


class BuildingBase(pydantic.BaseModel):
    name: str
    building_type: BuildingType
    location: str
    campus_key: Key[Literal["Campus"]]


class BuildingCreate(BuildingBase):
    pass


class BuildingResponse(BuildingBase):
    key: Key[Literal["Building"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=BuildingResponse, all_fields=True)
class BuildingModel:
    key: strawberry.ID
    campus_key: strawberry.ID

    @strawberry.field
    async def campus(
        self, info: strawberry.Info
    ) -> Annotated["CampusModel", strawberry.lazy(".campus")]:
        from .campus import CampusModel

        res = await info.context.data_loader.campus.load(self.campus_key)
        return CampusModel(
            key=res["key"], name=res["name"], address=res["address"]
        )

    @strawberry.field
    async def rooms(
        self, info: strawberry.Info
    ) -> list[Annotated["RoomModel", strawberry.lazy(".room")]]:
        from .room import RoomModel
        import json

        res = await info.context.data_loader.rooms_by_building.load(self.key)
        return [
            RoomModel(
                key=row["key"],
                name=row["name"],
                room_type=row["room_type"],
                capacity=row["capacity"],
                floor=row["floor"],
                facility=json.loads(row["facility"]),
                building_key=row["building_key"],
            )
            for row in res
        ]

    @strawberry.field
    async def metadata(
        self, info: strawberry.Info
    ) -> Annotated["BuildingMetadataModel", strawberry.lazy(".building_metadata")] | None:
        from .building_metadata import BuildingMetadataModel
        import db

        view = db.View(db.TableRegistry.BUILDING_METADATA).filter(
            "building_key = ?",
            (int(self.key),),
        )
        res = await info.context.db_context.execute(view)
        if not res:
            return None

        row = res[0]
        return BuildingMetadataModel(
            key=row["key"],
            building_key=row["building_key"],
            relative_x=row["relative_x"],
            relative_y=row["relative_y"],
            width=row["width"],
            depth=row["depth"],
            height=row["height"],
            rotation=row["rotation"],
        )


@strawberry.experimental.pydantic.input(model=BuildingCreate, all_fields=True)
class BuildingInput:
    campus_key: strawberry.ID
