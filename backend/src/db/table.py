import datetime
from typing import Optional, Type, Any, get_origin, get_args, Union
from pydantic import BaseModel
import shared as shared
from shared import key
from shared.log import log


def model_table_name(model: Type[BaseModel]) -> str:
    """Intelligently strip suffixes to get the base table name."""
    name = model.__name__
    # Strip common architecture suffixes
    for suffix in ("Response", "Create", "Base", "DB", "Model"):
        if name.endswith(suffix):
            name = name[: -len(suffix)]
            break
    return name.lower()


class Table:
    def __init__(
        self,
        primary_model: Optional[Type[BaseModel]] = None,
        name: Optional[str] = None,
        foreign_models: Optional[tuple[Type[BaseModel], ...]] = None,
        primary_keys: Optional[tuple[str, ...]] = None,
        attr: dict[str, str] = {},
        constraints: list[str] = [],
    ):
        self.primary_model = primary_model
        self.name = model_table_name(primary_model) if primary_model else name
        self.primary_keys = primary_keys

        # Pydantic v2 compatibility
        if primary_model is not None:
            self.fields = tuple(primary_model.model_fields.keys())
        else:
            self.fields = ()

        self.foreign_models = foreign_models if foreign_models else ()
        self.attr: dict[str, str] = attr
        self.constraint = constraints

    def get_create_sql(self) -> str:
        """Generate CREATE TABLE SQL dynamically based on Pydantic fields."""
        from typing import get_type_hints

        col_defs = []
        if self.primary_model:
            # get_type_hints resolves the actual Python types of the fields
            hints = get_type_hints(self.primary_model)

            for field_name in self.fields:
                py_type = hints.get(field_name, str)
                sql_type = self._python_to_sqlite(py_type)

                col = f"{field_name} {sql_type}"

                # Detect Primary Key: If the field is named 'key' AND
                # we haven't specified primary_keys
                if field_name == "key" and not self.primary_keys:
                    col += " PRIMARY KEY AUTOINCREMENT"
                elif field_name in self.attr.keys():
                    col += ' ' + self.attr[field_name]

                col_defs.append(col)

        # Handle Foreign Keys
        for foreign_model in self.foreign_models:
            fk_table_name = model_table_name(foreign_model)
            # or whatever shared.Key[foreign_model].name outputs
            fk_col_name = f"{fk_table_name}_key"

            # If the column wasn't naturally in the model, inject it (Fallback)
            if not any(c.startswith(fk_col_name) for c in col_defs):
                col_defs.append(f"{fk_col_name} INTEGER")

            # Append the foreign key constraint.
            col_defs.append(
                f"FOREIGN KEY ({fk_col_name}) REFERENCES {
                    fk_table_name}(key) ON DELETE CASCADE"
            )

        if self.primary_keys:
            col_defs.append(f"PRIMARY KEY ({', '.join(self.primary_keys)})")

        sql = (
            f"CREATE TABLE IF NOT EXISTS {self.name} (\n  "
            + ",\n  ".join(col_defs + self.constraint)
            + "\n);"
        )
        log("CREATE", "Generated SQL command", sql=sql, arguments=())
        return sql

    @staticmethod
    def _python_to_sqlite(py_type: Any) -> str:
        """Safely convert Python/Pydantic types to SQLite types,
        handling generics and Optionals.
        """
        origin = get_origin(py_type) or py_type

        # 1. Handle Optional types (e.g., int | None, Optional[str])
        from types import UnionType

        if origin is Union or origin is UnionType:
            args = get_args(py_type)
            non_none_types = [t for t in args if t is not type(None)]
            if non_none_types:
                # Recursively resolve the actual type
                return Table._python_to_sqlite(non_none_types[0])

        # 2. Handle your custom strongly typed Key
        if origin is shared.Key:
            return "INTEGER"

        # 3. Standard built-ins
        if origin is int:
            return "INTEGER"
        elif origin is str:
            return "TEXT"
        elif origin is bool:
            return "INTEGER"
        elif origin is float:
            return "REAL"
        elif origin is datetime.datetime:
            return "TIMESTAMP"

        # 4. Handle Pydantic models as JSON
        if isinstance(origin, type)and issubclass(origin, BaseModel):  # type: ignore
            return "JSON"

        return "TEXT"


__all__ = ["Table"]
