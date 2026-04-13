from .table_registry import TableRegistry
from .sql_command import SQLCommand


class TableView:
    def __init__(self, table: TableRegistry) -> None:
        self.table = table

    @property
    def sql(self) -> list[SQLCommand]:
        return [SQLCommand(f"SELECT * FROM {self.table.value.name}", ())]

    # @property
    # def priviledge(self) -> shared.Priviledge:
    #     return shared.Priviledge(0, 1, 0, 0)
