import strawberry
import backend.shared as shared
from backend.shared.model.campus import CampusModel
from backend.shared.model.building import BuildingModel
from backend.shared.model.room import RoomModel
import backend.db as db
from .context import ExecutionContext


@strawberry.type
class Query:
    @strawberry.field
    async def list_campus(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[CampusModel]:
        view = db.View(db.TableRegistry.CAMPUS)
        res = await info.context.db_context.execute(view)
        for row in res:
            print(dict(row))
        return [
            CampusModel(
                key=row["key"], name=row["name"], address=row["address"]
            )
            for row in res
        ]

    @strawberry.field
    async def list_building(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[BuildingModel]:
        view = db.View(db.TableRegistry.BUILDING)
        res = await info.context.db_context.execute(view)
        for row in res:
            print(dict(row))
        return [
            BuildingModel(
                key=row["key"],
                name=row["name"],
                building_type=row["building_type"],
                location=row["location"],
                campus_key=row["campus_key"],
            )
            for row in res
        ]

    @strawberry.field
    async def list_room(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[RoomModel]:
        view = db.View(db.TableRegistry.ROOM)
        res = await info.context.db_context.execute(view)
        for row in res:
            print(dict(row))
        return [
            RoomModel(
                key=row["key"],
                name=row["name"],
                room_type=row["room_type"],
                capacity=row["capacity"],
                power_outlet=row["power_outlet"],
                building_key=row["building_key"],
            )
            for row in res
        ]
