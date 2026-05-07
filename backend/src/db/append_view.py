import pydantic
from .table_view import TableView
from .sql_command import SQLCommand
from .sqlite_value import to_sqlite_value


class AppendView:
    def __init__(self, view: TableView, val: list) -> None:
        self.view = view
        if len(val) > 0 and not issubclass(type(val[0]), pydantic.BaseModel):
            raise Exception("Insert value must be a pydantic model.")
        self.val = val

    @property
    def sql(self) -> list[SQLCommand]:
        commands = []
        for v in self.val:
            data = v.model_dump()
            cols = ", ".join(data.keys())
            placeholders = ", ".join(["?" for _ in data])

            processed_values = [
                to_sqlite_value(value) for value in data.values()
            ]

            commands.append(
                SQLCommand(
                    f"""
INSERT INTO {self.view.table.value.name} ({cols}) VALUES ({placeholders})""",
                    tuple(processed_values),
                )
            )
        return commands + self.view.sql
