from enum import StrEnum
from typing import Annotated, Literal, TYPE_CHECKING

import pydantic
import strawberry

from shared.key import Key

if TYPE_CHECKING:
    from .building import BuildingModel


"""Pydantic Models"""


class BuildingEdgeType(StrEnum):
    WALKWAY = "walkway"
    INDOOR = "indoor"
    STAIRS = "stairs"
    SHUTTLE = "shuttle"
    OTHER = "other"


class BuildingEdgeBase(pydantic.BaseModel):
    from_building_key: Key[Literal["Building"]]
    to_building_key: Key[Literal["Building"]]
    walk_time_seconds: int
    distance_meters: float | None = None
    edge_type: BuildingEdgeType = BuildingEdgeType.WALKWAY
    bidirectional: bool = True


class BuildingEdgeCreate(BuildingEdgeBase):
    pass


class BuildingEdgeResponse(BuildingEdgeBase):
    key: Key[Literal["BuildingEdge"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(
    model=BuildingEdgeResponse, all_fields=True
)
class BuildingEdgeModel:
    key: strawberry.ID
    from_building_key: strawberry.ID
    to_building_key: strawberry.ID

    @strawberry.field
    async def from_building(
        self, info: strawberry.Info
    ) -> Annotated["BuildingModel", strawberry.lazy(".building")]:
        from .building import BuildingModel

        res = await info.context.data_loader.building.load(
            self.from_building_key
        )
        return BuildingModel(
            key=res["key"],
            name=res["name"],
            building_type=res["building_type"],
            location=res["location"],
            campus_key=res["campus_key"],
        )

    @strawberry.field
    async def to_building(
        self, info: strawberry.Info
    ) -> Annotated["BuildingModel", strawberry.lazy(".building")]:
        from .building import BuildingModel

        res = await info.context.data_loader.building.load(self.to_building_key)
        return BuildingModel(
            key=res["key"],
            name=res["name"],
            building_type=res["building_type"],
            location=res["location"],
            campus_key=res["campus_key"],
        )


@strawberry.experimental.pydantic.input(
    model=BuildingEdgeCreate, all_fields=True
)
class BuildingEdgeInput:
    from_building_key: strawberry.ID
    to_building_key: strawberry.ID
