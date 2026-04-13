from typing import Literal
import strawberry
from strawberry.scalars import JSON
from backend.shared.model.campus import CampusInput
from backend.shared.model.building import BuildingInput
from backend.shared.model.room import RoomInput
import backend.db as db
from .context import ExecutionContext
from backend.shared.key import Key


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
