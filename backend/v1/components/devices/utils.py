from pymongo.collection import Collection
from bson import ObjectId
from models import Device, Pump, Light, Filter, Heater
from dependencies.database import Connector, log_aquarium_history
from dependencies.auth import admin_required, login_required
from fastapi.responses import JSONResponse

from .wrappers import validate_device

connector = Connector()


def convert_mongo_id(document):
    """
    Converts MongoDB document _id field from ObjectId to string.
    """
    if "_id" in document and isinstance(document["_id"], ObjectId):
        document["_id"] = str(document["_id"])
    return document


"""
All functions below this comment implement basic API calls 
to modify create and delete devices primarily used in AquaMaker and AquaDecorator
Additional modules that can use these functions: Aqua Monitor, AquaLife
"""

@validate_device
def create_device(device: Pump | Light | Filter | Heater):
    try:
        connector.get_devices_collection().insert_one(device.model_dump())
    except Exception as e:
        print(e)
        print(f'Failed to create device: {device.model_dump()}')
        return {'code': 500, 'message': 'Failed to create device.'}
    return JSONResponse(content={'code': 200, 'message': 'Device created successfully'})


def get_all_devices():
    devices = connector.get_devices_collection().find()
    aquariums = []
    for s in devices:
        print(s)
        s = convert_mongo_id(s)
        aquariums.append(s)
    return JSONResponse(
        content={'code': 200, 'message': 'Devices retrieved successfully', 'Devices': aquariums})


@validate_device
def update_device(device: Device, device_id: str):
    if not connector.get_devices_collection().find_one:
        return {'code': 404, 'message': f'Aquarium {device_id} not found'}

    id = ObjectId(device_id)
    connector.get_devices_collection().find_one_and_update({'_id': id},
                                                           {'$set': device.model_dump()})
    return {'code': 200,
            'message': f'Device {device_id} updated successfully'}


def delete_device(device_id: str):
    id = ObjectId(device_id)
    if not connector.get_devices_collection().find_one({'_id': id}):
        return {'code': 404, 'message': f'Device {device_id} not found'}

    connector.get_devices_collection().delete_one({'_id': id})
    return {'code': 200, 'message': f'Device {device_id} deleted successfully'}


"""
model of test aquarium for easier testing

{
    "username": "test",
    "name": "testaq1",
    "height": 10,
    "width": 10,
    "length": 10,
    "substrate": "stone",
    "plants": {
        "vine": 1
    },
    "decorations": {
    },
    "temperature": 21,
    "ph": 6.9,
    "No2": 0.3,
    "No3": 0.4,
    "GH": 0.5,
    "KH": 0.6,
    "pump": {

    },
    "heater": {

    },
    "luminance": {

    },
    "accessories": {

    },
    "fish_species": {

    }
}

"""
