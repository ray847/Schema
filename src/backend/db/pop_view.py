import backend.shared as shared
from .table_view import TableView
from .sql_command import SQLCommand


class PopView:
    def __init__(self, view: TableView, key: shared.Key) -> None:
        self.view = view
        self.key = key

    @property
    def sql(self) -> list[SQLCommand]:
        delete_command = SQLCommand(
            f"DELETE FROM {self.view.table.value.name} WHERE key = ?",
            (int(self.key),),
        )

        # Return UPDATE followed by SELECT from the table view
        return [delete_command] + self.view.sql
