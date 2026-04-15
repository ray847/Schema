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
    ROOM = Table(
        primary_model=shared.model.RoomResponse,
        foreign_models=(shared.model.BuildingResponse,),
        attr={
            "name": "NOT NULL",
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
    # USER = Table(priviledge=PRIVATE_PRIVILEDGE, primary_model=User)

    @staticmethod
    def generate_sql_schema() -> list[str]:
        schema: list[str] = []
        for table in TableRegistry:
            schema.append(table.value.get_create_sql())
        return schema
