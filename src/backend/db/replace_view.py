import json
import enum
import pydantic
import backend.shared as shared
from .table_view import TableView
from .sql_command import SQLCommand


class ReplaceView:
    def __init__(
        self, view: TableView, key: shared.Key, replacements: dict
    ) -> None:
        self.view = view
        self.key = key
        self.replacements = replacements

    @property
    def sql(self) -> list[SQLCommand]:
        if not self.replacements:
            return self.view.sql

        set_clause = ", ".join([f"{k} = ?" for k in self.replacements.keys()])
        
        # Convert values to sqlite-compatible types
        processed_values = []
        for value in self.replacements.values():
            if isinstance(value, (dict, list)):
                processed_values.append(json.dumps(value))
            elif isinstance(value, enum.Enum):
                processed_values.append(value.value)
            elif isinstance(value, pydantic.BaseModel):
                processed_values.append(value.model_dump_json())
            else:
                processed_values.append(value)
        
        update_command = SQLCommand(
            f"UPDATE {self.view.table.value.name} SET {set_clause} WHERE key = ?",
            tuple(processed_values) + (int(self.key),)
        )
        
        # Return UPDATE followed by SELECT from the table view
        return [update_command] + self.view.sql
