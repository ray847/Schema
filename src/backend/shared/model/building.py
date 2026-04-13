from typing import Literal
from enum import StrEnum
import pydantic
import strawberry
from backend.shared.key import Key


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


@strawberry.experimental.pydantic.input(model=BuildingCreate, all_fields=True)
class BuildingInput:
    campus_key: strawberry.ID
