from fastapi import APIRouter, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

import sys
from os import path

from fastapi.params import File

from .utils import get_all_warnings, create_new_warning, update_warning, delete_warning

sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User, Warning
from dependencies.auth import get_admin_user, get_current_user, admin_required, login_required

router = APIRouter(prefix='/warnings')

tags_metadata = [
    {
        'name': 'Warning creator',
        'description': 'Admin permission required to create. Users can only GET warnings.'
    }
]


@admin_required
@router.post('', tags=['Warning creator'])
async def new_warning(warning: Warning, user: User = Depends(get_admin_user)):
    return create_new_warning(warning)


@admin_required
@router.put('/{warning_id}', tags=['Warning creator'])
async def update_warning_by_id(warning: Warning, warning_id: str, user: User = Depends(get_admin_user)):
    return update_warning(warning, warning_id)


@admin_required
@router.delete('/{warning_id}', tags=['Warning creator'])
async def delete_warning_by_id(warning_id: str, user: User = Depends(get_admin_user)):
    return delete_warning(warning_id)


@login_required
@router.get('', tags=['Warning creator'])
async def get_warnings(user: User = Depends(get_current_user)):
    return get_all_warnings()
