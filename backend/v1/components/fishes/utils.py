from bson import ObjectId

from models import FishSpecies, NewFishSpecies, User, Aquarium
from dependencies.database import Connector
from fastapi.responses import JSONResponse, FileResponse, Response
from .wrappers import validate_species
from ..aquariums.utils import update_aquarium

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


async def get_species_photo(species_name: str):
    species = db_connector.get_species_collection().find_one({'name': species_name.lower()})
    if not species:
        return {'code': 404, 'message': f'Fish species {species_name.lower()} not found'}

    photo = await db_connector.get_species_photo(species_name.lower())

    return Response(content=bytes(photo['photo']), media_type="image/png")





def get_aquarium_fishes(aquarium_name: str, user: User):
    aquarium = db_connector.get_aquariums_collection().find_one({'name': aquarium_name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {aquarium_name} not found for user {user.username}'}

    return {'code': 200, 'message': f'Fishes in {aquarium_name} retrieved successfully', 'fishes': aquarium['fishes']}


def add_fishes_to_aquarium(aquarium_name: str, user, species_name: str, specimen_amount: int):
    aquarium = db_connector.get_aquariums_collection().find_one({'name': aquarium_name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {aquarium_name} not found for user {user.username}'}

    new_aqarium = Aquarium(**aquarium)
    new_aqarium.fish_species[species_name] = specimen_amount
    return update_aquarium(new_aqarium, aquarium['_id'])


def remove_fishes_from_aquarium(aquarium_name: str, user, species_name: str, specimen_amount: int):
    aquarium = db_connector.get_aquariums_collection().find_one({'name': aquarium_name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {aquarium_name} not found for user {user.username}'}

    new_aqarium = Aquarium(**aquarium)
    if species_name not in new_aqarium.fish_species:
        return {'code': 404, 'message': f'Fish species {species_name} not found in {aquarium_name}'}

    new_aqarium.fish_species[species_name] -= specimen_amount
    if new_aqarium.fish_species[species_name] <= 0:
        del new_aqarium.fish_species[species_name]

    return update_aquarium(new_aqarium, aquarium['_id'])


def update_fish_species_in_aquarium(aquarium_name: str, user, species_name: str, new_species_name: str):
    aquarium = db_connector.get_aquariums_collection().find_one({'name': aquarium_name, 'username': user.username})
    if not aquarium:
        return {'code': 404, 'message': f'Aquarium {aquarium_name} not found for user {user.username}'}

    new_aqarium = Aquarium(**aquarium)
    if species_name not in new_aqarium.fish_species:
        return {'code': 404, 'message': f'Fish species {species_name} not found in {aquarium_name}'}

    new_aqarium.fish_species[new_species_name] = new_aqarium.fish_species.pop(species_name)
    return update_aquarium(new_aqarium, aquarium['_id'])


def get_aquariums(user: User):
    aquariums = db_connector.get_aquariums_collection().find({'username': user.username})
    aquariums_list = []
    for a in aquariums:
        a = convert_mongo_id(a)
        aquariums_list.append(a)
    return JSONResponse(
        content={'code': 200, 'message': 'Aquariums retrieved successfully', 'aquariums': aquariums_list})