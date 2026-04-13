from .viewlike import ViewLike
from .sql_command import SQLCommand


class SelectView:
    def __init__(self, view: ViewLike, properties: tuple[str]) -> None:
        self.view = view
        self.selected = properties

    @property
    def sql(self) -> list[SQLCommand]:
        inner = self.view.sql
        if not inner:
            return []
        
        last_command = inner[-1]
        # Wrap as subquery to ensure it works regardless of what's inside
        new_format = f"SELECT {', '.join(self.selected)} FROM ({last_command.format}) AS sub"
        
        return [*inner[:-1], SQLCommand(new_format, last_command.arguments)]

    # @property
    # def priviledge(self) -> shared.Priviledge:
    #     return shared.Priviledge(0, 1, 0, 0)
