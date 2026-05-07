from dataclasses import dataclass, field
from strawberry.fastapi import BaseContext
from .dataloader import DataLoader
import db as db
import shared


@dataclass
class ExecutionContext(BaseContext):
    current_user: shared.model.UserPublic | None = None
    db_context: db.DBContext = field(default_factory=db.DBContext)
    data_loader: DataLoader = field(init=False)

    def __post_init__(self) -> None:
        self.data_loader = DataLoader(self.db_context)
