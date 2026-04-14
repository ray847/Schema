from dataclasses import dataclass
from strawberry.fastapi import BaseContext
from .dataloader import DataLoader
import db as db


@dataclass
class ExecutionContext(BaseContext):
    db_context: db.DBContext = db.DBContext()
    data_loader: DataLoader = DataLoader(db_context)
