import json
import strawberry
from shared.model.campus import CampusModel
from shared.model.building import BuildingModel
from shared.model.building_edge import BuildingEdgeModel
from shared.model.room import RoomModel
from shared.model.person import PersonModel
from shared.model.course import CourseModel
from shared.model.activity import ActivityModel
from shared.model.course_teacher import CourseTeacherModel
from shared.model.allocation import AllocationModel
from shared.model.preference import PreferenceModel
import db
from .context import ExecutionContext
from . import preference as preference_service


@strawberry.type
class Query:
    @strawberry.field
    async def list_campus(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[CampusModel]:
        view = db.View(db.TableRegistry.CAMPUS)
        res = await info.context.db_context.execute(view)
        return [
            CampusModel(
                key=row["key"], name=row["name"], address=row["address"]
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_building(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[BuildingModel]:
        view = db.View(db.TableRegistry.BUILDING)
        res = await info.context.db_context.execute(view)
        return [
            BuildingModel(
                key=row["key"],
                name=row["name"],
                building_type=row["building_type"],
                location=row["location"],
                campus_key=row["campus_key"],
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_building_edge(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[BuildingEdgeModel]:
        view = db.View(db.TableRegistry.BUILDING_EDGE)
        res = await info.context.db_context.execute(view)
        return [
            BuildingEdgeModel(
                key=row["key"],
                from_building_key=row["from_building_key"],
                to_building_key=row["to_building_key"],
                walk_time_seconds=row["walk_time_seconds"],
                distance_meters=row["distance_meters"],
                edge_type=row["edge_type"],
                bidirectional=bool(row["bidirectional"]),
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_room(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[RoomModel]:
        view = db.View(db.TableRegistry.ROOM)
        res = await info.context.db_context.execute(view)
        return [
            RoomModel(
                key=row["key"],
                name=row["name"],
                room_type=row["room_type"],
                capacity=row["capacity"],
                floor=row["floor"],
                facility=json.loads(row["facility"]),
                building_key=row["building_key"],
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_person(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[PersonModel]:
        view = db.View(db.TableRegistry.PERSON)
        res = await info.context.db_context.execute(view)
        return [
            PersonModel(
                key=row["key"],
                name=row["name"],
                person_code=row["person_code"],
                role=row["role"],
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_course(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[CourseModel]:
        view = db.View(db.TableRegistry.COURSE)
        res = await info.context.db_context.execute(view)
        return [
            CourseModel(
                key=row["key"], name=row["name"], course_code=row["course_code"]
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_activity(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[ActivityModel]:
        view = db.View(db.TableRegistry.ACTIVITY)
        res = await info.context.db_context.execute(view)
        return [
            ActivityModel(
                key=row["key"], name=row["name"], person_key=row["person_key"]
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_course_teacher(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[CourseTeacherModel]:
        view = db.View(db.TableRegistry.COURSE_TEACHER)
        res = await info.context.db_context.execute(view)
        return [
            CourseTeacherModel(
                person_key=row["person_key"],
                course_key=row["course_key"],
                responsibility=row["responsibility"],
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_allocation(
        self, info: strawberry.Info[ExecutionContext]
    ) -> list[AllocationModel]:
        view = db.View(db.TableRegistry.ALLOCATION)
        res = await info.context.db_context.execute(view)
        return [
            AllocationModel(
                key=row["key"],
                room_key=row["room_key"],
                event_type=row["event_type"],
                event_key=row["event_key"],
                start_time=row["start_time"],
                end_time=row["end_time"],
            )
            for row in res  # type: ignore
        ]

    @strawberry.field
    async def list_preference(
        self,
        user_key: strawberry.ID,
        info: strawberry.Info[ExecutionContext],
    ) -> list[PreferenceModel]:
        res = await preference_service.list_preferences(int(user_key))
        return [
            PreferenceModel(
                key=preference.key,
                room_key=preference.room_key,
                building_key=preference.building_key,
                campus_key=preference.campus_key,
                value=preference.value,
            )
            for preference in res
        ]
