from pymongo.collection import Collection
from bson import ObjectId
from models import Aquarium, User, Event
from dependencies.database import Connector, log_aquarium_history
from fastapi.responses import JSONResponse
import datetime

from .wrappers import validate_aquarium

connector = Connector()


def convert_mongo_id(document):
    """
    Converts MongoDB document _id field from ObjectId to string.
    """
    if "_id" in document and isinstance(document["_id"], ObjectId):
        try:
            document["_id"] = str(document["_id"])
        except Exception as e:
            try:
                document[0] = document[0].valueOf()
            except Exception as e:
                print(f'Failed to convert _id to string: {e}')
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
        connector.get_aquariums_collection().insert_one(aquarium.dict())
        if not connector.get_aquariums_collection().find_one({'name': aquarium.name}):
            return {'code': 500, 'message': 'Failed to create aquarium'}
    except Exception as e:
        print(e)
        print(f'Failed to create aquarium: {aquarium.dict()}')
        return {'code': 500, 'message': 'Failed to create aquarium'}
    return JSONResponse(content={'code': 200, 'message': 'Aquarium created successfully'})


def get_user_aquariums(user: User):
    aquariums = connector.get_aquariums_collection().find({'username': user.username})
    ret_aquariums = []
    for s in aquariums:
        print(s)

        # convert date of birth to string
        for fish in s['fishes']:
            if isinstance(fish['date_of_birth'], datetime.datetime):
                fish['date_of_birth'] = fish['date_of_birth'].strftime('%Y-%m-%d')
            elif not fish or len(fish) == 0:
                del fish  # Remove empty fish
        s = convert_mongo_id(s)
        ret_aquariums.append(s)

    return JSONResponse(
        content={'code': 200, 'message': 'Aquariums retrieved successfully', 'Aquariums': ret_aquariums})


@validate_aquarium
@log_aquarium_history
def update_aquarium(aquarium_data: Aquarium, user: User):
    aquarium = connector.get_aquariums_collection().find_one({'name': aquarium_data.name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {aquarium_data.name} not found for user {user.username}'}

    connector.get_aquariums_collection().find_one_and_update({'name': aquarium_data.name, 'username': user.username},
                                                             {'$set': aquarium_data.model_dump()})

    #return {'code': 200,
    #        'message': f'{aquarium_data.name} updated successfully'}
    return JSONResponse(content={'code': 200, 'message': f'{aquarium_data.name} updated successfully'}, status_code=200)


def get_aquarium_history_by_name(aquarium_name: str, user: User):
    history = connector.get_aquarium_logs_collection().find({'username': user.username, 'name': aquarium_name})
    h = []
    for event in history:
        del event['_id']
        h.append(event)

    if len(h) == 0:
        return {'code': 404, 'message': f'No history found for aquarium {aquarium_name}'}

    return {'code': 200, 'message': f'History retrieved successfully', 'history': h}


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
        return JSONResponse(content={'code': 404, 'message': f'Aquarium {aquarium_name} not found for user {user.username}'})

    events = list(connector.get_events_collection().find({'aquarium_name': aquarium_name, 'username': user.username}))
    if not events or len(list(events)) == 0:
        return JSONResponse(content={'code': 204, 'message': f'No events found for aquarium {aquarium_name}'})

    e = []
    for event in events:
        event = convert_mongo_id(event)
        if event and 'event_time' in event and event['event_time']:
            if isinstance(event['event_time'], str):
                # Parse the string into a datetime object
                event['event_time'] = datetime.datetime.strptime(event['event_time'], '%Y-%m-%d')
            # Convert datetime object to string in desired format
            event['event_time'] = event['event_time'].strftime('%Y-%m-%d')
        e.append(event)

    return JSONResponse(content={'code': 200, 'message': f'Events retrieved successfully', 'events': e})


def add_event(event: Event, user: User):
    """
    Add an event to the aquarium
    """
    aquarium = connector.get_aquariums_collection().find_one({'name': event.aquarium_name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {event.aquarium_name} not found for user {user.username}'}

    event = event.dict()
    event['username'] = user.username
    event['active'] = True
    connector.get_events_collection().insert_one(event)
    return {'code': 200, 'message': 'Event added successfully'}


def dismiss_event_by_id(event_id: str, user: User):
    """
    Dismiss an event by ID
    """
    event = connector.get_events_collection().find_one({'_id': ObjectId(event_id), 'username': user.username})
    if not event:
        return {'code': 404, 'message': f'Event {event_id} not found'}

    connector.get_events_collection().find_one_and_update({'_id': ObjectId(event_id), 'username': user.username},
                                                          {'$set': {'active': False}})
    return {'code': 200, 'message': f'Event {event_id} dismissed successfully'}

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
