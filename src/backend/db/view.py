from .table_registry import TableRegistry
from .table_view import TableView
from .filter_view import FilterView
from .select_view import SelectView


class View:
    def __init__(self, table: TableRegistry) -> None:
        self.view = TableView(table)

    def filter(self, filter: str) -> "View":
        self.view = FilterView(self.view, filter)
        return self

    def select(self, properties: tuple[str]) -> "View":
        self.view = SelectView(self.view, properties)
        return self

    @property
    def sql(self) -> str:
        return self.view.sql
