from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from .schemas import Token
from .utils import login, manager, register, refresh_token, get_current_user

import sys
from os import path

sys.path.append(path.join(path.dirname(__file__), '...'))
from models import UserCreate, User
from .wrappers import login_required


router = APIRouter(prefix="/auth")


@router.post('/login', response_model=Token)
async def login_route(data: OAuth2PasswordRequestForm = Depends()):
    return login(data)


@router.post("/register")
async def register_user(user: UserCreate):
    return register(user)


@router.get('/logout')
async def logout_route():
    pass


@router.get('/me')
async def me_route(user=Depends(manager)):
    return user


@login_required
@router.get('/refresh_token')
async def refresh_token_route( user: User = Depends(get_current_user)):
    return refresh_token(user)
