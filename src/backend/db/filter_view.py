from .viewlike import ViewLike


class FilterView:
    def __init__(self, view: ViewLike, filter: str) -> None:
        self.view = view
        self.filter = filter

    @property
    def sql(self) -> str:
        return f"SELECT * FROM ({self.view.sql}) WHERE ({self.filter})"

    # @property
    # def priviledge(self) -> shared.Priviledge:
    #     return shared.Priviledge(0, 1, 0, 0)
