import datetime
import enum
import json
from typing import Any

import pydantic


def to_sqlite_value(value: Any) -> Any:
    if isinstance(value, datetime.datetime):
        if value.tzinfo is not None:
            value = value.astimezone().replace(tzinfo=None)
        return value.replace(microsecond=0).isoformat(sep=" ")
    if isinstance(value, (dict, list)):
        return json.dumps(value)
    if isinstance(value, enum.Enum):
        return value.value
    if isinstance(value, pydantic.BaseModel):
        return value.model_dump_json()
    return value
