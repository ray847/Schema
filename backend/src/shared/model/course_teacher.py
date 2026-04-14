from typing import Literal, TYPE_CHECKING, Annotated
import pydantic
import strawberry
from shared.key import Key

if TYPE_CHECKING:
    from .person import PersonModel
    from .course import CourseModel


"""Pydantic Models"""


class CourseTeacherBase(pydantic.BaseModel):
    person_key: Key[Literal["Person"]]
    course_key: Key[Literal["Course"]]
    responsibility: str


class CourseTeacherCreate(CourseTeacherBase):
    pass


class CourseTeacherResponse(CourseTeacherBase):
    pass


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=CourseTeacherResponse, all_fields=True)
class CourseTeacherModel:
    person_key: strawberry.ID
    course_key: strawberry.ID

    @strawberry.field
    async def person(
        self, info: strawberry.Info
    ) -> Annotated["PersonModel", strawberry.lazy(".person")]:
        from .person import PersonModel

        res = await info.context.data_loader.person.load(self.person_key)
        return PersonModel(
            key=res["key"],
            name=res["name"],
            person_code=res["person_code"],
            role=res["role"],
        )

    @strawberry.field
    async def course(
        self, info: strawberry.Info
    ) -> Annotated["CourseModel", strawberry.lazy(".course")]:
        from .course import CourseModel

        res = await info.context.data_loader.course.load(self.course_key)
        return CourseModel(
            key=res["key"], name=res["name"], course_code=res["course_code"]
        )


@strawberry.experimental.pydantic.input(
    model=CourseTeacherCreate, all_fields=True
)
class CourseTeacherInput:
    person_key: strawberry.ID
    course_key: strawberry.ID
