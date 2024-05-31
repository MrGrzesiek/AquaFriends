from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from .schemas import Token
from .utils import login, manager, register

import sys
from os import path
sys.path.append(path.join(path.dirname(__file__), '...'))
from models import UserCreate

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
async def me_route(user = Depends(manager)):
    return user
