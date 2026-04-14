from typing import Literal
import pydantic
import strawberry
from shared.key import Key


"""Pydantic Models"""


class PersonBase(pydantic.BaseModel):
    person_code: str
    name: str
    role: str


class PersonCreate(PersonBase):
    pass


class PersonResponse(PersonBase):
    key: Key[Literal["Person"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=PersonResponse, all_fields=True)
class PersonModel:
    key: strawberry.ID


@strawberry.experimental.pydantic.input(model=PersonCreate, all_fields=True)
class PersonInput:
    pass
