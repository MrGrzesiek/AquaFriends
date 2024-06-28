from fastapi import APIRouter, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

import sys
from os import path

from fastapi.params import File

sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User, FishSpecies, NewFishSpecies, FishInAquarium, FishRemoval
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required
from .utils import create_species, get_species, update_species, delete_species, upload_species_photo, get_species_photo, \
    get_aquarium_fishes, add_fishes_to_aquarium, delete_fish_from_aquarium

router = APIRouter(prefix='/fishes')

tags_metadata = [
    {
        'name': 'Fish species creator',
        'description': 'Admin permission required.'
    },
    {
        'name': 'Aquarium fishes',
        'description': 'User permission required.'
    }
]


@admin_required
@router.post('/species', tags=['Fish species creator'])
async def species(species: NewFishSpecies, user: User = Depends(get_admin_user)):
    result = await create_species(species)
    return result


@admin_required
@router.post('/species_photo/{species_name}', tags=['Fish species creator'])
async def species_photo(species_name, photo: UploadFile = File(...), user: User = Depends(get_admin_user)):
    photo.filename = f'{species_name}.{photo.filename.split(".")[-1]}'  # Rename photo to species_name.extension
    photo = await photo.read()
    result = await upload_species_photo(species_name, photo)
    return result


@login_required
@router.get('/species_photo/{species_name}', tags=['Fish species creator'])
async def species_photo(species_name: str, user: User = Depends(get_current_user)) -> FileResponse:
    result = await get_species_photo(species_name)
    return result


@login_required
@router.get('/species', tags=['Fish species creator'])
async def species(user: User = Depends(get_current_user)):
    result = await get_species()
    return result


@admin_required
@router.put('/species', tags=['Fish species creator'])
async def species(species: FishSpecies, user: User = Depends(get_admin_user)):
    result = await update_species(species)
    return result


@admin_required
@router.delete('/species', tags=['Fish species creator'])
async def species(species_name: str, user: User = Depends(get_admin_user)):
    result = await delete_species(species_name)
    return result


@login_required
@router.get('/aquarium/{aquarium_name}', tags=['Aquarium fishes'])
def get_fishes_in_aquarium(aquarium_name: str, user: User = Depends(get_current_user)):
    return get_aquarium_fishes(aquarium_name, user)


@login_required
@router.post('/aquarium/fish', tags=['Aquarium fishes'])
async def add_fish_to_aquarium(fish: FishInAquarium, user: User = Depends(get_current_user)):
    return add_fishes_to_aquarium(fish, user)


@login_required
@router.delete('/aquarium/fish/', tags=['Aquarium fishes'])
async def remove_fish(fish: FishRemoval, user: User = Depends(get_current_user)):
    return delete_fish_from_aquarium(fish, user)
