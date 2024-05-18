from fastapi import APIRouter
from fastapi import Depends, HTTPException
from fastapi_login import LoginManager
from ...dependencies.auth.models import User
from ...dependencies.auth.dependencies import manager, get_current_active_user, get_admin_user

router = APIRouter()

@router.get('/public')
def public():
    return "Public text"

@router.get('secret-user')
def secret(user: User = Depends(get_current_active_user)):
    if not in user.scopes:
        raise HTTPException(status_code=401, detail="User or Admin not in scope")

@router.get('secret-admin')
def secret(user: User = Depends(get_current_active_user)):
    if 'Admin' not in user.scopes:
        raise HTTPException(status_code=401, detail="User or Admin not in scope")