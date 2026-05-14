import enum
import shared as shared
from shared.model.facility import Facility
from .table import Table


class TableRegistry(enum.Enum):
    CAMPUS = Table(
        primary_model=shared.model.CampusResponse,
        attr={"name": "NOT NULL UNIQUE"},
    )
    BUILDING = Table(
        primary_model=shared.model.BuildingResponse,
        foreign_models=(shared.model.CampusResponse,),
        attr={"name": "NOT NULL"},
    )
    BUILDING_METADATA = Table(
        primary_model=shared.model.BuildingMetadataResponse,
        name="BuildingMetadata",
        foreign_models=(shared.model.BuildingResponse,),
        attr={
            "building_key": "NOT NULL UNIQUE",
            "relative_x": "NOT NULL",
            "relative_y": "NOT NULL",
            "width": "NOT NULL",
            "depth": "NOT NULL",
            "height": "NOT NULL",
            "rotation": "NOT NULL DEFAULT 0.0",
        },
        constraints=[
            "CHECK (width > 0)",
            "CHECK (depth > 0)",
            "CHECK (height > 0)",
        ],
    )
    BUILDING_EDGE = Table(
        primary_model=shared.model.BuildingEdgeResponse,
        name="BuildingEdge",
        foreign_models=(
            ("from_building_key", shared.model.BuildingResponse),
            ("to_building_key", shared.model.BuildingResponse),
        ),
        attr={
            "from_building_key": "NOT NULL",
            "to_building_key": "NOT NULL",
            "walk_time_seconds": "NOT NULL",
            "edge_type": "NOT NULL DEFAULT 'walkway'",
            "bidirectional": "NOT NULL DEFAULT 1",
        },
        constraints=[
            "CHECK (from_building_key <> to_building_key)",
            "CHECK (walk_time_seconds > 0)",
            "CHECK (distance_meters IS NULL OR distance_meters >= 0)",
            "UNIQUE (from_building_key, to_building_key, edge_type)",
        ],
    )
    ROOM = Table(
        primary_model=shared.model.RoomResponse,
        foreign_models=(shared.model.BuildingResponse,),
        attr={
            "name": "NOT NULL",
            "floor": "NOT NULL DEFAULT 1",
            "facility": f"DEFAULT '{Facility(power_outlet=0.0).model_dump_json()}'",
        },
        constraints=["CHECK (capacity > 0)"],
    )
    PERSON = Table(
        primary_model=shared.model.PersonResponse,
        attr={"name": "NOT NULL"}
    )
    COURSE = Table(
        primary_model=shared.model.CourseResponse,
        attr={
            "course_code": "UNIQUE NOT NULL",
            "name": "NOT NULL",
        },
    )
    ACTIVITY = Table(
        primary_model=shared.model.ActivityResponse,
        foreign_models=(shared.model.PersonResponse,),
        attr={
            "name": "NOT NULL",
        },
    )
    COURSE_TEACHER = Table(
        primary_model=shared.model.CourseTeacherResponse,
        foreign_models=(
            shared.model.PersonResponse,
            shared.model.CourseResponse,
        ),
        primary_keys=("person_key", "course_key"),
    )
    ALLOCATION = Table(
        primary_model=shared.model.AllocationResponse,
        foreign_models=(shared.model.RoomResponse,),
        attr={
            "start_time": "NOT NULL",
            "end_time": "NOT NULL",
        },
        constraints=["CHECK (start_time < end_time)"]
    )
    USER = Table(
        primary_model=shared.model.UserResponse,
        foreign_models=(shared.model.PersonResponse,),
        attr={
            "person_key": "UNIQUE",
            "email": "UNIQUE NOT NULL",
            "password_hash": "NOT NULL",
            "type": "NOT NULL DEFAULT 'standard'",
        },
    )
    PREFERENCE = Table(
        primary_model=shared.model.PreferenceResponse,
        foreign_models=(
            shared.model.UserResponse,
            shared.model.RoomResponse,
            shared.model.BuildingResponse,
            shared.model.CampusResponse,
        ),
        attr={
            "user_key": "NOT NULL",
            "value": "NOT NULL",
        },
        constraints=[
            "CHECK (value >= -1.0 AND value <= 1.0)",
            """
CHECK (
  (room_key IS NOT NULL)
  + (building_key IS NOT NULL)
  + (campus_key IS NOT NULL)
  = 1
)""",
            "UNIQUE (user_key, room_key)",
            "UNIQUE (user_key, building_key)",
            "UNIQUE (user_key, campus_key)",
        ],
    )

    @staticmethod
    def generate_sql_schema() -> list[str]:
        schema: list[str] = []
        for table in TableRegistry:
            schema.append(table.value.get_create_sql())
        return schema
