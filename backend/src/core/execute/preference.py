import sqlite3
from typing import Literal

from fastapi import HTTPException, status

import db
from shared.key import Key
from shared.model import PreferenceBase, PreferenceCreate, PreferenceResponse


def _preference_from_row(row) -> PreferenceResponse:
    return PreferenceResponse(
        key=row["key"],
        user_key=row["user_key"],
        room_key=row["room_key"],
        building_key=row["building_key"],
        campus_key=row["campus_key"],
        value=row["value"],
    )


def _same_target(row: PreferenceResponse, preference: PreferenceCreate) -> bool:
    return (
        row.room_key == preference.room_key
        and row.building_key == preference.building_key
        and row.campus_key == preference.campus_key
    )


async def list_preferences(
    user_key: int,
) -> list[PreferenceResponse]:
    view = db.View(db.TableRegistry.PREFERENCE).filter(
        "user_key = ?",
        (user_key,),
    )
    rows = await db.DBContext().execute(view)
    return [_preference_from_row(row) for row in rows]  # type: ignore


async def create_preference(
    user_key: int, preference: PreferenceCreate, db_context: db.DBContext
) -> None:
    record = PreferenceBase(
        user_key=Key[Literal["User"]](user_key),
        room_key=preference.room_key,
        building_key=preference.building_key,
        campus_key=preference.campus_key,
        value=preference.value,
    )
    view = db.View(db.TableRegistry.PREFERENCE).append([record])

    try:
        _ = await db_context.execute(view)
    except sqlite3.IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Preference target is invalid or already exists for this user",
        ) from error


async def delete_preference(
    user_key: int, preference_key: int, db_context: db.DBContext
) -> None:
    existing = await list_preferences(user_key)
    if not any(int(row.key) == preference_key for row in existing):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preference not found",
        )

    view = db.View(db.TableRegistry.PREFERENCE).pop(
        {"key": preference_key, "user_key": user_key}
    )
    await db_context.execute(view)


async def update_preference(
    user_key: int,
    preference_key: int,
    preference: PreferenceCreate,
    db_context: db.DBContext,
) -> None:
    existing = await list_preferences(user_key)
    if not any(int(row.key) == preference_key for row in existing):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preference not found",
        )

    record = PreferenceBase(
        user_key=Key[Literal["User"]](user_key),
        room_key=preference.room_key,
        building_key=preference.building_key,
        campus_key=preference.campus_key,
        value=preference.value,
    )
    replacements = record.model_dump(exclude={"user_key"})
    view = db.View(db.TableRegistry.PREFERENCE).replace(
        {"key": preference_key, "user_key": user_key},
        replacements,
    )

    try:
        _ = await db_context.execute(view)
    except sqlite3.IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Preference target is invalid or already exists for this user",
        ) from error
