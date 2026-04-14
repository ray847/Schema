from .table_registry import TableRegistry
from .table_view import TableView
from .filter_view import FilterView
from .select_view import SelectView
from .append_view import AppendView
from .replace_view import ReplaceView
from .pop_view import PopView
from .sql_command import SQLCommand
import shared


class View:
    def __init__(self, table: TableRegistry) -> None:
        self.view = TableView(table)

    def filter(self, filter: str, arguments: tuple = ()) -> "View":
        self.view = FilterView(self.view, filter, arguments)
        return self

    def select(self, properties: tuple[str]) -> "View":
        self.view = SelectView(self.view, properties)
        return self

    def append(self, val: list) -> "View":
        if isinstance(self.view, TableView):
            self.view = AppendView(self.view, val)
        else:
            raise Exception("Append is only applicable to table views.")
        return self

    def replace(self, key: shared.Key, replacements: dict) -> "View":
        if isinstance(self.view, TableView):
            self.view = ReplaceView(self.view, key, replacements)
        else:
            raise Exception("Replace is only applicable to table views.")
        return self

    def pop(self, key: shared.Key) -> "View":
        if isinstance(self.view, TableView):
            self.view = PopView(self.view, key)
        else:
            raise Exception("Replace is only applicable to table views.")
        return self

    @property
    def sql(self) -> list[SQLCommand]:
        return self.view.sql
