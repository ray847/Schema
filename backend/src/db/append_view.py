import json
import enum
import pydantic
from .table_view import TableView
from .sql_command import SQLCommand


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

            # Convert values to sqlite-compatible types
            processed_values = []
            for value in data.values():
                if isinstance(value, (dict, list)):
                    processed_values.append(json.dumps(value))
                elif isinstance(value, enum.Enum):
                    processed_values.append(value.value)
                elif isinstance(value, pydantic.BaseModel):
                    processed_values.append(value.model_dump_json())
                else:
                    processed_values.append(value)

            commands.append(
                SQLCommand(
                    f"""
INSERT INTO {self.view.table.value.name} ({cols}) VALUES ({placeholders})""",
                    tuple(processed_values),
                )
            )
        return commands + self.view.sql
