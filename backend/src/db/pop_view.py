import shared
from .table_view import TableView
from .sql_command import SQLCommand


class PopView:
    def __init__(self, view: TableView, key: shared.Key | dict) -> None:
        self.view = view
        self.key = key

    @property
    def sql(self) -> list[SQLCommand]:
        if isinstance(self.key, dict):
            where_clause = " AND ".join([f"{k} = ?" for k in self.key.keys()])
            where_values = tuple(self.key.values())
        else:
            where_clause = "key = ?"
            where_values = (int(self.key),)

        delete_command = SQLCommand(
            f"DELETE FROM {self.view.table.value.name} WHERE {where_clause}",
            where_values,
        )

        # Return UPDATE followed by SELECT from the table view
        return [delete_command] + self.view.sql
