from typing import Literal
import pydantic
import strawberry
from backend.shared.key import Key


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


@strawberry.experimental.pydantic.input(model=CampusCreate, all_fields=True)
class CampusInput:
    pass
