from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from .utils import create_aquarium, get_all_aquariums, update_aquarium, delete_aquarium
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


router = APIRouter(prefix='/aquariums')

"""
All routes implement basic API calls 
to modify create and delete aquariums primarily used in AquaMaker and AquaDecorator
Additional modules that can use these functions: Aqua Monitor, AquaLife
"""

"""
Create an Aquarium associated to user
AquaMaker, AquaDecorator
@:param None
"""
@login_required
@router.post('/new_aquarium')
async def create_new_aquarium(aquarium: Aquarium, user: User = Depends(get_admin_user)):
    result = create_aquarium(aquarium)
    return result

"""
Fetch all aquariums associated to user
"""
@login_required
@router.get('/all_aquariums')
async def list_aquariums(user: User = Depends(get_current_user)):
    aquariums = get_all_aquariums()
    return aquariums

"""
Update an aquarium with given id associated to user
AquaMaker, AquaDecorator
@:param aquarium_id : String
"""
@admin_required
@router.put('/update/{aquarium_id}')
async def update_existing_aquarium(aquarium: Aquarium, aquarium_id, user: User = Depends(get_admin_user)):
   result = update_aquarium(aquarium, aquarium_id)
   return result

"""
Delete an aquarium with given id associated to user
@param aquarium_id : String
"""
@admin_required
@router.delete('/delete/{aquarium_id}')
async def delete_existing_aquarium(aquarium_id: str, user: User = Depends(get_admin_user)):
    result = delete_aquarium(aquarium_id)
    return result
