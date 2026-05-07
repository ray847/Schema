import shared
from .table_view import TableView
from .sql_command import SQLCommand
from .sqlite_value import to_sqlite_value


class ReplaceView:
    def __init__(
        self, view: TableView, key: shared.Key | dict, replacements: dict
    ) -> None:
        self.view = view
        self.key = key
        self.replacements = replacements

    @property
    def sql(self) -> list[SQLCommand]:
        if not self.replacements:
            return self.view.sql

        set_clause = ", ".join([f"{k} = ?" for k in self.replacements.keys()])

        processed_values = [
            to_sqlite_value(value) for value in self.replacements.values()
        ]

        if isinstance(self.key, dict):
            where_clause = " AND ".join([f"{k} = ?" for k in self.key.keys()])
            where_values = tuple(self.key.values())
        else:
            where_clause = "key = ?"
            where_values = (int(self.key),)

        update_command = SQLCommand(
            f"UPDATE {self.view.table.value.name} SET {
                set_clause} WHERE {where_clause}",
            tuple(processed_values) + where_values,
        )

        # Return UPDATE followed by SELECT from the table view
        return [update_command] + self.view.sql
