from fastapi import APIRouter, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

import sys
from os import path

from fastapi.params import File

sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User, FishSpecies, NewFishSpecies
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required
from .utils import create_species, get_species, update_species, delete_species, upload_species_photo

router = APIRouter(prefix='/fishes')


@admin_required
@router.post('/species')
async def species(species: NewFishSpecies, user: User = Depends(get_admin_user)):
    result = await create_species(species)
    return result

@admin_required
@router.post('/species_photo/{species_name}')
async def species_photo(species_name, photo: UploadFile = File(...), user: User = Depends(get_admin_user)):
    photo.filename = f'{species_name}.{photo.filename.split(".")[-1]}'  # Rename photo to species_name.extension
    photo = await photo.read()
    result = await upload_species_photo(species_name, photo)
    return result

@login_required
@router.get('/species_photo/{species_name}')
async def species_photo(species_name: str, user: User = Depends(get_current_user)):# -> FileResponse | dict:
    # return get_species_photo(species_name)
    return {'message': 'Not implemented', 'code': 501}


@login_required
@router.get('/species')
async def species(user: User = Depends(get_current_user)):
    result = await get_species()
    return result


@admin_required
@router.put('/species')
async def species(species: FishSpecies, user: User = Depends(get_admin_user)):
    result = await update_species(species)
    return result


@admin_required
@router.delete('/species')
async def species(species_name: str, user: User = Depends(get_admin_user)):
    result = await delete_species(species_name)
    return result

