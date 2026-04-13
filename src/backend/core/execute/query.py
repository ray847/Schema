import strawberry
import shared
import backend.db as db
from .context import ExecutionContext
from shared.model.campus import CampusType


@strawberry.type
class Query:
    @strawberry.field
    async def list_campus(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[shared.model.CampusType]:
        view = db.View(db.TableRegistry.CAMPUS)
        res = await info.context.db_context.execute(view)
        for row in res:
            print(dict(row))
        return [
            CampusType(key=row["key"], name=row["name"], address=row["address"])
            for row in res
        ]

    # @strawberry.field
    # def building() -> list[shared.Building]: ...

    # @strawberry.field
    # def room() -> list[shared.Room]: ...
