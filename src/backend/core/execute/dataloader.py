from typing import List, Literal
import strawberry
import strawberry.dataloader
import shared.model
import backend.db as db


async def load_campus(
    keys: List[int], context: db.DBContext
) -> list[shared.model.CampusResponse]:
    view = db.View(db.TableRegistry.CAMPUS).filter(
        f"{shared.Key[Literal['Campus']].name} IN ({', '.join([str(key) for key in keys])})"
    )
    res = await context.execute(view)
    return res


class DataLoader:
    def __init__(self, context: db.DBContext) -> None:
        self.campus = strawberry.dataloader.DataLoader(
            lambda keys: load_campus(keys, context)  # type: ignore
        )
