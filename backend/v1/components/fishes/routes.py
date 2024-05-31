from fastapi import APIRouter
from fastapi import Depends, HTTPException

import sys
from os import path
sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User, FishSpecies, NewFishSpecies
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required
from .utils import create_species, get_species, update_species, delete_species

router = APIRouter(prefix='/fishes')


@admin_required
@router.post('/species')
async def species(species: NewFishSpecies): #, user: User = Depends(get_admin_user)):
    return create_species(species)


@login_required
@router.get('/species')
async def species(user: User = Depends(get_current_user)):
    return get_species()


@admin_required
@router.put('/species')
async def species(species: FishSpecies, user: User = Depends(get_admin_user)):
    return update_species(species)


@admin_required
@router.delete('/species')
async def species(species_name: str, user: User = Depends(get_admin_user)):
    return delete_species(species_name)


