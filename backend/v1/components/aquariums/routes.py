from fastapi import APIRouter
from fastapi import Depends, HTTPException
from fastapi_login import LoginManager

from dependencies.auth.dependencies import get_current_active_user, get_admin_user
from dependencies.auth.models import User

router = APIRouter(prefix='/aquariums')

@router.get('/public')
def public():
    return "Public text"

@router.get('/secret-user')
def secret(user: User = Depends(get_current_active_user)):
    if not any(scope in user.scopes for scope in ['user', 'admin']):
        raise HTTPException(status_code=401, detail="User or Admin not in scope")
    return "Secret text for users or admins"

@router.get('/secret-admin')
def secret(user: User = Depends(get_admin_user)):
    if 'admin' not in user.scopes:
        raise HTTPException(status_code=401, detail="User or Admin not in scope")
    return "Secret text for admins"

