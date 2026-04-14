from typing import Protocol
from .sql_command import SQLCommand


class ViewLike(Protocol):
    @property
    def sql(self) -> list[SQLCommand]: ...

    # @property
    # def priviledge(self) -> shared.Priviledge: ...
