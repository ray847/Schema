from typing import Literal

import pydantic
import strawberry

from shared.key import Key


class PreferenceBase(pydantic.BaseModel):
    user_key: Key[Literal["User"]]
    room_key: Key[Literal["Room"]] | None = None
    building_key: Key[Literal["Building"]] | None = None
    campus_key: Key[Literal["Campus"]] | None = None
    value: float = pydantic.Field(ge=-1.0, le=1.0)

    @pydantic.model_validator(mode="after")
    def require_one_target(self) -> "PreferenceBase":
        target_count = sum(
            target is not None
            for target in (self.room_key, self.building_key, self.campus_key)
        )
        if target_count != 1:
            raise ValueError(
                "Preference must reference exactly one room, building, or campus"
            )
        return self


class PreferenceCreate(pydantic.BaseModel):
    room_key: Key[Literal["Room"]] | None = None
    building_key: Key[Literal["Building"]] | None = None
    campus_key: Key[Literal["Campus"]] | None = None
    value: float = pydantic.Field(ge=-1.0, le=1.0)

    @pydantic.model_validator(mode="after")
    def require_one_target(self) -> "PreferenceCreate":
        target_count = sum(
            target is not None
            for target in (self.room_key, self.building_key, self.campus_key)
        )
        if target_count != 1:
            raise ValueError(
                "Preference must reference exactly one room, building, or campus"
            )
        return self


class PreferenceResponse(PreferenceBase):
    key: Key[Literal["Preference"]]


@strawberry.type
class PreferenceModel:
    key: strawberry.ID
    room_key: strawberry.ID | None
    building_key: strawberry.ID | None
    campus_key: strawberry.ID | None
    value: float


@strawberry.experimental.pydantic.input(model=PreferenceCreate, all_fields=True)
class PreferenceInput:
    room_key: strawberry.ID | None
    building_key: strawberry.ID | None
    campus_key: strawberry.ID | None
