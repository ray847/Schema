import strawberry
from backend.shared.model.campus import CampusInput
from backend.shared.model.building import BuildingInput
from backend.shared.model.room import RoomInput
import backend.db as db
from .context import ExecutionContext


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
        self, inputs: list[BuildingInput], info: strawberry.Info[ExecutionContext]
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
