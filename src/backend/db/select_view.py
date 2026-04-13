from .viewlike import ViewLike


class SelectView:
    def __init__(self, view: ViewLike, properties: tuple[str]) -> None:
        self.view = view
        self.selected = properties

    @property
    def sql(self) -> str:
        return f"SELECT {', '.join(self.selected)} FROM ({self.view.sql})"

    # @property
    # def priviledge(self) -> shared.Priviledge:
    #     return shared.Priviledge(0, 1, 0, 0)
