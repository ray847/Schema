from typing import List, Literal
import strawberry
import strawberry.dataloader
import shared
import db


async def load_campus(
    keys: List[shared.Key[Literal["Campus"]]], context: db.DBContext
) -> list[shared.model.CampusResponse]:
    placeholders = ", ".join(["?" for _ in keys])
    view = db.View(db.TableRegistry.CAMPUS).filter(
        f"key IN ({placeholders})", tuple(int(k) for k in keys)
    )
    res = await context.execute(view)
    # Map results to ensure they match the order of requested keys
    lookup = {row["key"]: row for row in res}
    return [lookup.get(int(key)) for key in keys]  # type: ignore


async def load_building(
    keys: List[shared.Key[Literal["Building"]]], context: db.DBContext
) -> list[shared.model.BuildingResponse]:
    placeholders = ", ".join(["?" for _ in keys])
    view = db.View(db.TableRegistry.BUILDING).filter(
        f"key IN ({placeholders})", tuple(int(k) for k in keys)
    )
    res = await context.execute(view)
    lookup = {row["key"]: row for row in res}
    return [lookup.get(int(key)) for key in keys]  # type: ignore


async def load_buildings_by_campus(
    keys: List[shared.Key[Literal["Campus"]]], context: db.DBContext
) -> list[list[shared.model.BuildingResponse]]:
    placeholders = ", ".join(["?" for _ in keys])
    view = db.View(db.TableRegistry.BUILDING).filter(
        f"campus_key IN ({placeholders})", tuple(int(k) for k in keys)
    )
    res = await context.execute(view)
    from collections import defaultdict

    lookup = defaultdict(list)
    for row in res:
        lookup[row["campus_key"]].append(row)
    return [lookup[int(key)] for key in keys]


async def load_rooms_by_building(
    keys: List[shared.Key[Literal["Building"]]], context: db.DBContext
) -> list[list[shared.model.RoomResponse]]:
    placeholders = ", ".join(["?" for _ in keys])
    view = db.View(db.TableRegistry.ROOM).filter(
        f"building_key IN ({placeholders})", tuple(int(k) for k in keys)
    )
    res = await context.execute(view)
    from collections import defaultdict

    lookup = defaultdict(list)
    for row in res:
        lookup[row["building_key"]].append(row)
    return [lookup[int(key)] for key in keys]


async def load_room(
    keys: List[shared.Key[Literal["Room"]]], context: db.DBContext
) -> list[shared.model.RoomResponse]:
    placeholders = ", ".join(["?" for _ in keys])
    view = db.View(db.TableRegistry.ROOM).filter(
        f"key IN ({placeholders})", tuple(int(k) for k in keys)
    )
    res = await context.execute(view)
    lookup = {row["key"]: row for row in res}
    return [lookup.get(int(key)) for key in keys]  # type: ignore


async def load_person(
    keys: List[shared.Key[Literal["Person"]]], context: db.DBContext
) -> list[shared.model.PersonResponse]:
    placeholders = ", ".join(["?" for _ in keys])
    view = db.View(db.TableRegistry.PERSON).filter(
        f"key IN ({placeholders})", tuple(int(k) for k in keys)
    )
    res = await context.execute(view)
    lookup = {row["key"]: row for row in res}
    return [lookup.get(int(key)) for key in keys]  # type: ignore


async def load_course(
    keys: List[shared.Key[Literal["Course"]]], context: db.DBContext
) -> list[shared.model.CourseResponse]:
    placeholders = ", ".join(["?" for _ in keys])
    view = db.View(db.TableRegistry.COURSE).filter(
        f"key IN ({placeholders})", tuple(int(k) for k in keys)
    )
    res = await context.execute(view)
    lookup = {row["key"]: row for row in res}
    return [lookup.get(int(key)) for key in keys]  # type: ignore


class DataLoader:
    def __init__(self, context: db.DBContext) -> None:
        self.campus = strawberry.dataloader.DataLoader(
            lambda keys: load_campus(keys, context)  # type: ignore
        )
        self.building = strawberry.dataloader.DataLoader(
            lambda keys: load_building(keys, context)  # type: ignore
        )
        self.room = strawberry.dataloader.DataLoader(
            lambda keys: load_room(keys, context)  # type: ignore
        )
        self.person = strawberry.dataloader.DataLoader(
            lambda keys: load_person(keys, context)  # type: ignore
        )
        self.course = strawberry.dataloader.DataLoader(
            lambda keys: load_course(keys, context)  # type: ignore
        )
        self.buildings_by_campus = strawberry.dataloader.DataLoader(
            lambda keys: load_buildings_by_campus(keys, context)  # type: ignore
        )
        self.rooms_by_building = strawberry.dataloader.DataLoader(
            lambda keys: load_rooms_by_building(keys, context)  # type: ignore
        )
