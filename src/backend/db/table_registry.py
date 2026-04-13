import enum
import shared
from .table import Table


class TableRegistry(enum.Enum):
    CAMPUS = Table(primary_model=shared.model.CampusResponse)
    # BUILDING = Table(
    #     priviledge=PUBLIC_PRIVILEDGE,
    #     primary_model=Building,
    #     foreign_models=(Campus,),
    # )
    # ROOM = Table(
    #     priviledge=PUBLIC_PRIVILEDGE,
    #     primary_model=Room,
    #     foreign_models=(Building,),
    # )
    # USER = Table(priviledge=PRIVATE_PRIVILEDGE, primary_model=User)

    @staticmethod
    def generate_sql_schema() -> str:
        schema: str = ""
        for table in TableRegistry:
            schema += table.value.get_create_sql() + "\n"
        return schema
