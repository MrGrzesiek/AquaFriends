from fastapi import APIRouter
from fastapi import Depends, HTTPException

import sys
from os import path
sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User
from dependencies.auth import get_current_active_user, get_admin_user, login_required, admin_required

router = APIRouter(prefix='/aquariums')

@router.get('/public')
def public():
    return "Public text"


@login_required
@router.get('/secret-user')
def secret(user: User = Depends(get_current_active_user)):
    return "Secret text for users or admins"


@admin_required
@router.get('/secret-admin')
def secret(user: User = Depends(get_admin_user)):
    return "Secret text for admins"




