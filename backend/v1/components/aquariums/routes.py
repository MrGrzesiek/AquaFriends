from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import JSONResponse

from .utils import create_aquarium, get_user_aquariums, update_aquarium, delete_aquarium, get_events, add_event, \
    get_user_aquariums, get_aquarium_history_by_name, dismiss_event_by_id
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required, \
    get_current_active_user
from models import User, Aquarium, Event

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
async def create_new_aquarium(aquarium: Aquarium, user: User = Depends(get_current_user)):
    result = create_aquarium(aquarium)
    return result


"""
Fetch all aquariums associated to user
"""


@login_required
@router.get('/user_aquariums')
async def list_aquariums(user: User = Depends(get_current_user)):
    aquariums = get_user_aquariums(user)
    return aquariums


"""
Update an aquarium with given id associated to user
AquaMaker, AquaDecorator
@:param aquarium_id : String
"""


@login_required
@router.get('/get_aquarium/{aquarium_id}')
async def get_aquarium(aquarium_id: str):
    result = get_aquarium(aquarium_id)
    return result


@login_required
@router.put('/update')
async def update_existing_aquarium(aquarium: Aquarium, user: User = Depends(get_current_user)):
    result = update_aquarium(aquarium, user)
    return result


"""
Delete an aquarium with given id associated to user
@param aquarium_id : String
"""


@login_required
@router.delete('/delete/{aquarium_id}')
async def delete_existing_aquarium(aquarium_id: str, user: User = Depends(get_current_user)):
    result = delete_aquarium(aquarium_id)
    return result


"""
Events
"""


@login_required
@router.get('/events/{aquarium_name}')
async def get_aquarium_events(aquarium_name: str, user: User = Depends(get_current_user)):
    return get_events(aquarium_name, user)


@login_required
@router.post('/event')
async def add_aquarium_event(event: Event, user: User = Depends(get_current_user)):
    return add_event(event, user)


@login_required
@router.delete('/dismiss_event/{event_id}')
async def dismiss_event(event_id: str, user: User = Depends(get_current_user)):
    return dismiss_event_by_id(event_id, user)


"""
History
"""


@login_required
@router.get('/history/{aquarium_name}')
async def get_aquarium_history(aquarium_name: str, user: User = Depends(get_current_user)):
    return get_aquarium_history_by_name(aquarium_name, user)
