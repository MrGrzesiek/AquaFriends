from fastapi import APIRouter
from fastapi import Depends, HTTPException

import sys
from os import path
sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User, FishSpecies
from dependencies.auth.dependencies import get_admin_user

router = APIRouter(prefix='/fishes')

@router.post('/species')
def species(species: FishSpecies, user: User = Depends(get_admin_user)):
    if not user or 'admin' not in user.scopes:
        raise HTTPException(status_code=401, detail="User or Admin not in scope")
    return "Fish species addin"