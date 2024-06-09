from pymongo.collection import Collection
from bson import ObjectId
from models import Aquarium
from dependencies.database.database_connector import Connector
from fastapi.responses import JSONResponse

connector = Connector()


def create_aquarium(aquarium: Aquarium):
    try:
        connector.get_aquariums_collection().insert_one(aquarium.model_dump())

    except Exception as e:
        print(e)
        print(f'Failed to create fish species: {aquarium.model_dump()}')
        return {'code': 500, 'message': 'Failed to create fish species'}
    return JSONResponse(content={'code': 200, 'message': 'Fish species created successfully'})


def get_all_aquariums():
    collection = connector.get_aquariums_collection()
    if collection:
        return list(collection.find({}))
    return []


def get_aquarium_by_id(aquarium_id: ObjectId):
    collection = connector.get_aquariums_collection()
    if collection:
        return collection.find_one({"_id": aquarium_id})
    return None


def update_aquarium(aquarium_data: Aquarium):
    collection = connector.get_aquariums_collection()
    if collection:
        result = collection.update_one({"_id": aquarium_data.id}, {"$set": aquarium_data.model_dump(by_alias=True)})
        return result.modified_count > 0
    return False


def delete_aquarium(aquarium_id: ObjectId):
    collection = connector.get_aquariums_collection()
    if collection:
        result = collection.delete_one({"_id": aquarium_id})
        return result.deleted_count > 0
    return False
