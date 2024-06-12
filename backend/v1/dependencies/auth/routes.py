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

tags_metadata = [
    {
        'name': 'Authentication and registration',
    }
]


@router.post('/login', response_model=Token, tags=['Authentication and registration'])
async def login_route(data: OAuth2PasswordRequestForm = Depends()):
    return login(data)


@router.post('/register', tags=['Authentication and registration'])
async def register_user(user: UserCreate):
    return register(user)


@router.get('/logout', tags=['Authentication and registration'])
async def logout_route():
    pass


@router.get('/me', tags=['Authentication and registration'])
async def me_route(user=Depends(manager)):
    return user


@login_required
@router.get('/refresh_token', tags=['Authentication and registration'])
async def refresh_token_route(user: User = Depends(get_current_user)):
    return refresh_token(user)
