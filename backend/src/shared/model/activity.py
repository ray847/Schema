from typing import Literal, TYPE_CHECKING, Annotated
import pydantic
import strawberry
from shared.key import Key

if TYPE_CHECKING:
    from .person import PersonModel


"""Pydantic Models"""


class ActivityBase(pydantic.BaseModel):
    name: str
    person_key: Key[Literal["Person"]]


class ActivityCreate(ActivityBase):
    pass


class ActivityResponse(ActivityBase):
    key: Key[Literal["Activity"]]


"""Strawberry Wrappers"""


@strawberry.experimental.pydantic.type(model=ActivityResponse, all_fields=True)
class ActivityModel:
    key: strawberry.ID
    person_key: strawberry.ID

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


@strawberry.experimental.pydantic.input(model=ActivityCreate, all_fields=True)
class ActivityInput:
    person_key: strawberry.ID
