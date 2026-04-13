from typing import Protocol


class ViewLike(Protocol):
    @property
    def sql(self) -> str: ...

    # @property
    # def priviledge(self) -> shared.Priviledge: ...
