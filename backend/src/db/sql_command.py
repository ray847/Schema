from dataclasses import dataclass


@dataclass
class SQLCommand:
    format: str
    arguments: tuple
