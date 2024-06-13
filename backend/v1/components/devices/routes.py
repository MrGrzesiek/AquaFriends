from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from .utils import create_aquarium, get_all_aquariums, update_aquarium, delete_aquarium
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required, \
    get_current_active_user
from models import User, Aquarium

router = APIRouter(prefix='/devices', tags=['Devices and devices prefix'])

"""
Module for handling aquarium accessories and devices
"""

"""
Create a device
@:param None
"""


@admin_required
@router.post('/new_device')
async def create_new_aquarium(aquarium: Aquarium, user: User = Depends(get_current_user)):
    result = create_aquarium(aquarium)
    return result


"""
Fetch all devices with optional filter
@:param None
"""


@login_required
@router.get('/all_devices')
async def list_aquariums(user: User = Depends(get_current_user)):
    aquariums = get_all_aquariums()
    return aquariums


"""
Update device
@:param device_id : String
"""


@admin_required
@router.put('/update/{device_id}')
async def update_existing_aquarium(aquarium: Aquarium, aquarium_id, user: User = Depends(get_current_user)):
    result = update_aquarium(aquarium, aquarium_id)
    return result


"""
Delete a device with given id
@param device_id : String
"""


@admin_required
@router.delete('/delete/{aquarium_id}')
async def delete_existing_aquarium(aquarium_id: str, user: User = Depends(get_current_user)):
    result = delete_aquarium(aquarium_id)
    return result
