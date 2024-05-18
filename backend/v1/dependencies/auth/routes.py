from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from .schemas import Token
from .dependencies import login, manager

router = APIRouter()

@router.post('/login', response_model=Token)
def login_route(data: OAuth2PasswordRequestForm = Depends()):
    return login(data)
