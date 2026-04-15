from typing import Literal
import strawberry
from strawberry.scalars import JSON
from shared.model.campus import CampusInput
from shared.model.building import BuildingInput
from shared.model.room import RoomInput
from shared.model.person import PersonInput
from shared.model.course import CourseInput
from shared.model.activity import ActivityInput
from shared.model.course_teacher import CourseTeacherInput
from shared.model.allocation import AllocationInput
import db as db
from .context import ExecutionContext
from shared.key import Key


@strawberry.type
class Mutation:
    """Create, Update, Delete Operations"""

    @strawberry.field
    async def create_campus(
        self, inputs: list[CampusInput], info: strawberry.Info[ExecutionContext]
    ) -> None:
        view = db.View(db.TableRegistry.CAMPUS).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def create_building(
        self,
        inputs: list[BuildingInput],
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.BUILDING).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def create_room(
        self, inputs: list[RoomInput], info: strawberry.Info[ExecutionContext]
    ) -> None:
        view = db.View(db.TableRegistry.ROOM).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def create_person(
        self, inputs: list[PersonInput], info: strawberry.Info[ExecutionContext]
    ) -> None:
        view = db.View(db.TableRegistry.PERSON).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def create_course(
        self, inputs: list[CourseInput], info: strawberry.Info[ExecutionContext]
    ) -> None:
        view = db.View(db.TableRegistry.COURSE).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def create_activity(
        self,
        inputs: list[ActivityInput],
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.ACTIVITY).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def create_course_teacher(
        self,
        inputs: list[CourseTeacherInput],
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.COURSE_TEACHER).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def create_allocation(
        self,
        inputs: list[AllocationInput],
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.ALLOCATION).append(
            [input.to_pydantic() for input in inputs]
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_campus(
        self,
        key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.CAMPUS.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        view = db.View(db.TableRegistry.CAMPUS).replace(
            Key[Literal["Campus"]](key), filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_building(
        self,
        key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.BUILDING.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        view = db.View(db.TableRegistry.BUILDING).replace(
            Key[Literal["Building"]](key), filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_room(
        self,
        key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.ROOM.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        view = db.View(db.TableRegistry.ROOM).replace(
            Key[Literal["Room"]](key), filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_person(
        self,
        key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.PERSON.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        view = db.View(db.TableRegistry.PERSON).replace(
            Key[Literal["Person"]](key), filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_course(
        self,
        key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.COURSE.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        view = db.View(db.TableRegistry.COURSE).replace(
            Key[Literal["Course"]](key), filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_activity(
        self,
        key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.ACTIVITY.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        view = db.View(db.TableRegistry.ACTIVITY).replace(
            Key[Literal["Activity"]](key), filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_course_teacher(
        self,
        person_key: strawberry.ID,
        course_key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.COURSE_TEACHER.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        composite_key = {
            "person_key": int(person_key),
            "course_key": int(course_key),
        }
        view = db.View(db.TableRegistry.COURSE_TEACHER).replace(
            composite_key, filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_course_teacher(
        self,
        person_key: strawberry.ID,
        course_key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        composite_key = {
            "person_key": int(person_key),
            "course_key": int(course_key),
        }
        view = db.View(db.TableRegistry.COURSE_TEACHER).pop(composite_key)
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def update_allocation(
        self,
        key: strawberry.ID,
        replacements: JSON,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        model = db.TableRegistry.ALLOCATION.value.primary_model
        data = replacements if isinstance(replacements, dict) else {}
        filtered = {
            k: v for k, v in data.items() if k in getattr(model, "model_fields")
        }
        view = db.View(db.TableRegistry.ALLOCATION).replace(
            Key[Literal["Allocation"]](key), filtered
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_campus(
        self,
        key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.CAMPUS).pop(Key[Literal["Campus"]](key))
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_building(
        self,
        key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.BUILDING).pop(
            Key[Literal["Building"]](key)
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_room(
        self,
        key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.ROOM).pop(Key[Literal["Room"]](key))
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_person(
        self,
        key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.PERSON).pop(Key[Literal["Person"]](key))
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_course(
        self,
        key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.COURSE).pop(Key[Literal["Course"]](key))
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_activity(
        self,
        key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.ACTIVITY).pop(
            Key[Literal["Activity"]](key)
        )
        _ = await info.context.db_context.execute(view)

    @strawberry.field
    async def delete_allocation(
        self,
        key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> None:
        view = db.View(db.TableRegistry.ALLOCATION).pop(
            Key[Literal["Allocation"]](key)
        )
        _ = await info.context.db_context.execute(view)
