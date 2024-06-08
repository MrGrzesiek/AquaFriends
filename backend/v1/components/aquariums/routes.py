from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from .utils import create_aquarium, get_all_aquariums, update_aquarium, delete_aquarium, get_aquarium_by_id
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required, \
    get_current_active_user
from models import User, Aquarium

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


router = APIRouter(prefix='/Aquariums')


@login_required
@router.post('/new_aquarium')
async def create_new_aquarium(aquarium: Aquarium, user: User = Depends(get_admin_user)):
    Aquarium_id = create_aquarium(aquarium)
    if not Aquarium_id:
        raise HTTPException(status_code=500, detail="Failed to create Aquarium")
    return {"Aquarium_id": str(Aquarium_id)}


@login_required
@router.get('/all_aquariums')
async def list_aquariums(user: User = Depends(get_current_user)):
    Aquariums = get_all_aquariums()
    return Aquariums


@login_required
@router.get('/{aquarium_id}')
async def read_aquarium(aquarium_id: str, user: User = Depends(get_current_user)):
    Aquarium = get_aquarium_by_id(ObjectId(aquarium_id))
    if not Aquarium:
        raise HTTPException(status_code=404, detail="Aquarium not found")
    return Aquarium

@admin_required
@router.put('/update/{aquarium_id}')
async def update_existing_aquarium(aquarium: Aquarium, user: User = Depends(get_admin_user)):
    success = update_aquarium(aquarium)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update Aquarium")
    return {"message": "Aquarium updated successfully"}


@admin_required
@router.delete('/delete/{aquarium_id}')
async def delete_existing_aquarium(aquarium_id: str, user: User = Depends(get_admin_user)):
    success = delete_aquarium(ObjectId(aquarium_id))
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete Aquarium")
    return {"message": "Aquarium deleted successfully"}
