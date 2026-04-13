from .viewlike import ViewLike
from .sql_command import SQLCommand


class FilterView:
    def __init__(self, view: ViewLike, filter: str, arguments: tuple = ()) -> None:
        self.view = view
        self.filter = filter
        self.arguments = arguments

    @property
    def sql(self) -> list[SQLCommand]:
        inner = self.view.sql
        if not inner:
            return []
        
        last_command = inner[-1]
        new_format = f"{last_command.format} WHERE {self.filter}"
        new_arguments = last_command.arguments + self.arguments
        
        return [*inner[:-1], SQLCommand(new_format, new_arguments)]
