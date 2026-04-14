from typing import Literal
import pydantic
import strawberry
from shared.key import Key


"""Pydantic Models"""


class CourseBase(pydantic.BaseModel):
    course_code: str
    name: str


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    key: Key[Literal["Course"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=CourseBase, all_fields=True)
class CourseModel:
    key: strawberry.ID


@strawberry.experimental.pydantic.input(model=CourseCreate, all_fields=True)
class CourseInput:
    pass
