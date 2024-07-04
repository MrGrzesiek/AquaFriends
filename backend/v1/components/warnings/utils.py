from datetime import timedelta, datetime

from bson import ObjectId

from models import Warning
from dependencies.database import Connector
from fastapi.responses import JSONResponse, FileResponse, Response
from .wrappers import validate_warning
from ..aquariums.utils import update_aquarium

db_connector = Connector()


def convert_mongo_id(document):
    """
    Converts MongoDB document _id field from ObjectId to string.
    """
    if "_id" in document and isinstance(document["_id"], ObjectId):
        document["_id"] = str(document["_id"])
    return document


@validate_warning
def create_new_warning(warning: Warning):
    warning_id = db_connector.get_warnings_collection().insert_one(warning.dict()).inserted_id
    return JSONResponse(content={'warning_id': str(warning_id)}, status_code=200)


@validate_warning
def update_warning(warning: Warning, warning_id: str):
    old_warning = db_connector.get_warnings_collection().find_one({'_id': ObjectId(warning_id)})
    if not old_warning:
        return JSONResponse(content={'message': 'Warning not found'}, status_code=404)

    db_connector.get_warnings_collection().update_one({'_id': ObjectId(warning_id)}, {'$set': warning.dict()})
    return JSONResponse(content={'message': 'Warning updated successfully'}, status_code=200)


def get_all_warnings():
    warnings = list(db_connector.get_warnings_collection().find())
    if not warnings or len(warnings) == 0:
        return JSONResponse(content={'message': 'No warnings found'}, status_code=404)

    all_warnings = []
    for warning in warnings:
        warning = convert_mongo_id(warning)
        all_warnings.append(warning)

    return JSONResponse(content={'warnings': warnings}, status_code=200)


def delete_warning(warning_id: str):
    warning = db_connector.get_warnings_collection().find_one({'_id': ObjectId(warning_id)})
    if not warning:
        return JSONResponse(content={'message': 'Warning not found'}, status_code=404)

    db_connector.get_warnings_collection().delete_one({'_id': ObjectId(warning_id)})
    return JSONResponse(content={'message': 'Warning deleted successfully'}, status_code=200)
