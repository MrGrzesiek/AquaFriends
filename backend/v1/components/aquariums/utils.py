from pymongo.collection import Collection
from bson import ObjectId
from models import Aquarium, User, Event
from dependencies.database import Connector, log_aquarium_history
from fastapi.responses import JSONResponse

from .wrappers import validate_aquarium

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
to modify create and delete aquariums primarily used in AquaMaker and AquaDecorator
Additional modules that can use these functions: Aqua Monitor, AquaLife
"""


@validate_aquarium
@log_aquarium_history
def create_aquarium(aquarium: Aquarium):
    try:
        connector.get_aquariums_collection().insert_one(aquarium.model_dump())
    except Exception as e:
        print(e)
        print(f'Failed to create fish species: {aquarium.model_dump()}')
        return {'code': 500, 'message': 'Failed to create aquarium'}
    return JSONResponse(content={'code': 200, 'message': 'Aquarium created successfully'})


def get_all_aquariums():
    aquariums = connector.get_aquariums_collection().find()
    aquariums = []
    for s in aquariums:
        print(s)
        s = convert_mongo_id(s)
        aquariums.append(s)
    return JSONResponse(
        content={'code': 200, 'message': 'Aquariums retrieved successfully', 'Aquariums': aquariums})


@validate_aquarium
@log_aquarium_history
def update_aquarium(aquarium_data: Aquarium, aquarium_id: str):
    if not connector.get_aquariums_collection().find_one:
        return {'code': 404, 'message': f'Aquarium {aquarium_id} not found'}

    id = ObjectId(aquarium_id)
    connector.get_aquariums_collection().find_one_and_update({'_id': id},
                                                             {'$set': aquarium_data.model_dump()})
    return {'code': 200,
            'message': f'{aquarium_id} updated successfully'}


def delete_aquarium(aquarium_id: str):
    id = ObjectId(aquarium_id)
    if not connector.get_aquariums_collection().find_one({'_id': id}):
        return {'code': 404, 'message': f'Aquarium {aquarium_id} not found'}

    # Delete the fish species
    connector.get_aquariums_collection().delete_one({'_id': id})
    return {'code': 200, 'message': f'{aquarium_id} deleted successfully'}



def get_events(aquarium_name: str, user: User):
    """
    Get all events associated with an aquarium
    """
    aquarium = connector.get_aquariums_collection().find_one({'name': aquarium_name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {aquarium_name} not found for user {user.username}'}

    events = connector.get_events_collection().find({'aquarium_name': aquarium_name, 'username': user.username})
    if not events:
        return {'code': 404, 'message': f'No events found for aquarium {aquarium_name}'}

    e = []
    for event in events:
        event = convert_mongo_id(event)
        e.append(event)

    return {'code': 200, 'message': f'Events retrieved successfully', 'events': e}


def add_event(event: Event, user: User):
    """
    Add an event to the aquarium
    """
    aquarium = connector.get_aquariums_collection().find_one({'name': event.aquarium_name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {event.aquarium_name} not found for user {user.username}'}

    event = event.dict()
    event['username'] = user.username
    connector.get_events_collection().insert_one(event)
    return {'code': 200, 'message': 'Event added successfully'}

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
