import enum
import backend.shared as shared
from .table import Table


class TableRegistry(enum.Enum):
    CAMPUS = Table(primary_model=shared.model.CampusResponse)
    BUILDING = Table(
        primary_model=shared.model.BuildingResponse,
        foreign_models=(shared.model.CampusResponse,),
    )
    ROOM = Table(
        primary_model=shared.model.RoomResponse,
        foreign_models=(shared.model.BuildingResponse,),
    )
    # USER = Table(priviledge=PRIVATE_PRIVILEDGE, primary_model=User)

    @staticmethod
    def generate_sql_schema() -> list[str]:
        schema: list[str] = []
        for table in TableRegistry:
            schema.append(table.value.get_create_sql())
        return schema
