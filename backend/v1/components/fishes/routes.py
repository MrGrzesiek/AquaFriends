from fastapi import APIRouter
from fastapi import Depends, HTTPException

import sys
from os import path
sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User, FishSpecies, NewFishSpecies
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required

router = APIRouter(prefix='/fishes')


@admin_required
@router.post('/species')
def species(species: NewFishSpecies, user: User = Depends(get_admin_user)):
    return {"message": "Not implemented yet", "code": "501"}


@login_required
@router.get('/species')
def species(species_id: int, user: User = Depends(get_current_user)):
    return {"message": "Not implemented yet", "code": "501"}


@admin_required
@router.put('/species')
def species(species: FishSpecies, user: User = Depends(get_admin_user)):
    return {"message": "Not implemented yet", "code": "501"}


@admin_required
@router.delete('/species')
def species(species_id: int, user: User = Depends(get_admin_user)):
    return {"message": "Not implemented yet", "code": "501"}


