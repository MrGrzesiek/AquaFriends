from fastapi import APIRouter, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

import sys
from os import path

from fastapi.params import File

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
async def species(warning: Warning, user: User = Depends(get_admin_user)):
    return {'code': 501, 'message': 'Not implemented'}


@admin_required
@router.put('/{warning_id}', tags=['Warning creator'])
async def species(warning: Warning, user: User = Depends(get_admin_user)):
    return {'code': 501, 'message': 'Not implemented'}


@admin_required
@router.delete('/{warning_id}', tags=['Warning creator'])
async def species(warning_id: str, user: User = Depends(get_admin_user)):
    return {'code': 501, 'message': 'Not implemented'}


@login_required
@router.get('', tags=['Warning creator'])
async def species(user: User = Depends(get_current_user)):
    return {'code': 501, 'message': 'Not implemented'}
