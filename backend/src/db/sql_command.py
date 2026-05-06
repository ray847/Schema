from dataclasses import dataclass

from shared.log import log


@dataclass
class SQLCommand:
    format: str
    arguments: tuple

    def __post_init__(self) -> None:
        operation = self.format.strip().split(maxsplit=1)[0].upper()
        log(
            operation,
            "Generated SQL command",
            sql=self.format,
            arguments=self.arguments,
        )
