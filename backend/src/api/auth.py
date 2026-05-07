from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field

import core.auth as auth_service
from shared.model import UserPublic


router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


class RegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=1)


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/register", response_model=UserPublic)
def register_user(request: RegisterRequest) -> UserPublic:
    return auth_service.register_user(
        email=request.email,
        password=request.password,
    )


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = auth_service.authenticate_user(
        form_data.username,
        form_data.password,
    )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(
        access_token=auth_service.create_access_token(user),
        token_type="bearer",
    )


@router.get("/me", response_model=UserPublic)
def read_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> UserPublic:
    return auth_service.user_from_token(token)
