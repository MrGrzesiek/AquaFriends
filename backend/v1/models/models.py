from typing import List, Dict, Annotated

from bson import ObjectId
from fastapi import UploadFile
from pydantic import BaseModel, Field
import datetime


class ActiveSession(BaseModel):
    username: str
    access_token: str
    expiry_time: datetime.datetime


class Aquarium(BaseModel):
    """
    Class used to represent an aquarium in the database
    """
    id: int
    name: str
    dimensions: List[Dict[str, int]]
    components: List[Dict[str, int]]


class User(BaseModel):
    """
    Class used for authentication purposes with login manager
    """
    email: str
    scopes: List[str]


class UserInDB(User):
    """
    Class used to represent a user in the database
    """
    username: str
    email: str
    password_hash: str
    scopes: List[str]


class UserCreate(BaseModel):
    """
    Class usages:
    - User registration
    - Registration request body validation
    """
    username: str
    password_hash: str
    email: str


class NewFishSpecies(BaseModel):
    """
    Class used to represent a fish species model during creation
    """
    name: str
    description: str
    min_temp: float
    max_temp: float
    min_ph: float
    max_ph: float
    min_salinity: float
    max_salinity: float


class FishSpecies(NewFishSpecies):
    """
    Class used to represent a fish species in the database
    Photos need to be uploaded to the database separately
    """
    disliked_species: List[int] # List of fish species IDs that this species does not get along with
