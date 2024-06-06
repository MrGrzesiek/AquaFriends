from bson import ObjectId
from fastapi import HTTPException, File
from pymongo import collection

from models import FishSpecies, NewFishSpecies
from dependencies.database import Connector
from fastapi.responses import JSONResponse, FileResponse
from .wrappers import validate_species

db_connector = Connector()


@validate_species
async def create_species(fish_species: NewFishSpecies):
    try:
        # Check if fish species with this name already exists
        if db_connector.get_species_collection().find_one({'name': fish_species.name.lower()}):
            return {'code': 400, 'message': 'Fish species with this name already exists'}

        # Convert NewFishSpecies to FishSpecies model
        new_species = FishSpecies(**fish_species.dict(), disliked_species=[])
        new_species.name = new_species.name.lower()

        db_connector.get_species_collection().insert_one(new_species.dict())
    except Exception as e:
        print(e)
        print(f'Failed to create fish species: {fish_species.dict()}')
        return {'code': 500, 'message': 'Failed to create fish species'}
    return JSONResponse(content={'code': 200, 'message': 'Fish species created successfully'})


def convert_mongo_id(document):
    """
    Converts MongoDB document _id field from ObjectId to string.
    """
    if "_id" in document and isinstance(document["_id"], ObjectId):
        document["_id"] = str(document["_id"])
    return document


async def get_species():
    species = db_connector.get_species_collection().find()
    species_list = []
    for s in species:
        print(s)
        s = convert_mongo_id(s)
        species_list.append(s)
    return JSONResponse(
        content={'code': 200, 'message': 'Fish species retrieved successfully', 'species': species_list})


@validate_species
async def update_species(species_data: FishSpecies):
    species_data.name = species_data.name.lower()
    # Check if fish species with this name exists
    species = db_connector.get_species_collection().find_one({'name': species_data.name})
    if not species:
        return {'code': 404, 'message': f'Fish species {species_data.name} not found'}

    # Update the fish species
    db_connector.get_species_collection().find_one_and_update({'name': species_data.name},
                                                              {'$set': species_data.dict()})
    return {'code': 200,
            'message': f'{species_data.name} species updated successfully'}  # , 'species': updated_species}


async def delete_species(species_name: str):
    # Check if fish species with this name exists
    species = db_connector.get_species_collection().find_one({'name': species_name.lower()})
    if not species:
        return {'code': 404, 'message': f'Fish species {species_name.lower()} not found'}

    # Delete the fish species
    db_connector.get_species_collection().delete_one({'name': species_name.lower()})
    return {'code': 200, 'message': f'{species_name.lower()} species deleted successfully'}


async def upload_species_photo(species_name: str, photo: bytes):
    result = await db_connector.upload_species_photo(species_name, photo)
    return result


def get_species_photo(species_name: str) -> FileResponse | dict:
    species = db_connector.get_species_collection().find_one({'name': species_name.lower()})
    if not species:
        return {'code': 404, 'message': f'Fish species {species_name.lower()} not found'}

    photo = db_connector.get_file_collection().find_one({'species': species_name.lower()})
