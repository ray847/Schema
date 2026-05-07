from fastapi import HTTPException, status

import db
from shared.model import UserPublic, UserType


def is_private_table(table: db.TableRegistry) -> bool:
    return table in {db.TableRegistry.USER, db.TableRegistry.PREFERENCE}


def require_authenticated_user(
    current_user: UserPublic | None,
) -> UserPublic:
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


def require_admin(current_user: UserPublic | None) -> UserPublic:
    user = require_authenticated_user(current_user)
    if user.type != UserType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
