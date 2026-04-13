from .table_registry import TableRegistry


class TableView:
    def __init__(self, table: TableRegistry) -> None:
        self.table = table

    @property
    def sql(self) -> str:
        return f"SELECT * FROM {self.table.value.name}"

    # @property
    # def priviledge(self) -> shared.Priviledge:
    #     return shared.Priviledge(0, 1, 0, 0)
