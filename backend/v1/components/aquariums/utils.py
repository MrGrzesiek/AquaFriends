from pymongo.collection import Collection
from bson import ObjectId
from models import Aquarium
from dependencies.database.database_connector import Connector

connector = Connector(mongo_uri="your_mongo_uri_here")


def create_aquarium(aquarium_data: Aquarium):
    collection = connector.get_aquariums_collection()
    if collection:
        result = collection.insert_one(aquarium_data.model_dump(by_alias=True))
        return result.inserted_id
    return None


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
