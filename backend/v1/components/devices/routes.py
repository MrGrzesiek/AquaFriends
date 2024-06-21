from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from .utils import *
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required, \
    get_current_active_user
from models import User, Device, Pump, Filter, Heater, Light

router = APIRouter(prefix='/devices')


tags_metadata = [
    {
        'name': 'Device creator',
        'description': 'Admin permission required.',
    }
]
"""
Module for handling aquarium accessories and devices
"""

"""
Create a device
@:param None
"""


@admin_required
@router.post('/new_device', tags=['Device creator'])
async def create_new_device(device: Pump | Light | Filter | Heater, user: User = Depends(get_current_user)):
    result = create_device(device)
    return result


"""
Fetch all devices with optional filter
@:param None
"""


@login_required
@router.get('/all_devices',tags=['Device creator'])
async def list_devices(user: User = Depends(get_current_user)):
    result = get_all_devices()
    return result


"""
Update device
@:param device_id : String
"""


@admin_required
@router.put('/update/{device_id}', tags=['Device creator'])
async def update_existing_device(device: Pump | Light | Filter | Heater, device_id, user: User = Depends(get_current_user)):
    return update_device(device, device_id)


"""
Delete a device with given id
@param device_id : String
"""


@admin_required
@router.delete('/delete/{device_id}', tags=['Device creator'])
async def delete_existing_device(device_id: str, user: User = Depends(get_current_user)):
    result = delete_device(device_id)
    return result
