from typing import Literal, TYPE_CHECKING, Annotated
import pydantic
import strawberry
from backend.shared.key import Key

if TYPE_CHECKING:
    from .building import BuildingModel


"""Pydantic Models"""


class CampusBase(pydantic.BaseModel):
    name: str
    address: str


class CampusCreate(CampusBase):
    pass


class CampusResponse(CampusBase):
    key: Key[Literal["Campus"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=CampusResponse, all_fields=True)
class CampusModel:
    key: strawberry.ID

    @strawberry.field
    async def buildings(
        self, info: strawberry.Info
    ) -> list[Annotated["BuildingModel", strawberry.lazy(".building")]]:
        from .building import BuildingModel

        res = await info.context.data_loader.buildings_by_campus.load(self.key)
        return [
            BuildingModel(
                key=row["key"],
                name=row["name"],
                building_type=row["building_type"],
                location=row["location"],
                campus_key=row["campus_key"],
            )
            for row in res
        ]


@strawberry.experimental.pydantic.input(model=CampusCreate, all_fields=True)
class CampusInput:
    pass
