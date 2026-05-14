from typing import Annotated, Literal, TYPE_CHECKING

import pydantic
import strawberry

from shared.key import Key

if TYPE_CHECKING:
    from .building import BuildingModel


"""Pydantic Models"""


class BuildingMetadataBase(pydantic.BaseModel):
    building_key: Key[Literal["Building"]]
    relative_x: float
    relative_y: float
    width: float
    depth: float
    height: float
    rotation: float = 0.0


class BuildingMetadataCreate(BuildingMetadataBase):
    pass


class BuildingMetadataResponse(BuildingMetadataBase):
    key: Key[Literal["BuildingMetadata"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(
    model=BuildingMetadataResponse,
    all_fields=True,
)
class BuildingMetadataModel:
    key: strawberry.ID
    building_key: strawberry.ID

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


@strawberry.experimental.pydantic.input(
    model=BuildingMetadataCreate,
    all_fields=True,
)
class BuildingMetadataInput:
    building_key: strawberry.ID
