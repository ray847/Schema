import dataclasses
import db


@dataclasses.dataclass
class BackendContext:
    db_context: db.DBContext
