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
    Class used to create a new Aquarium
    """
    username: str
    name: str
    height: float
    width: float
    length: float
    substrate: str
    plants: Dict[str, int]
    decorations: Dict[str, int]
    temperature: float
    ph: float
    No2: float
    No3: float
    GH: float
    KH: float
    pump: Dict[str, int]
    heater: Dict[str, int]
    luminance: Dict[str, int]
    accessories: Dict[str, str]
    fish_species: Dict[str, int]


class User(BaseModel):
    """
    Class used for authentication purposes with login manager
    """
    email: str
    username: str
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
    disliked_species: List[int]  # List of fish species IDs that this species does not get along with


class Device(BaseModel):
    """
    Class used to represent a device in the database
    """
    name: str
    power: int
    minV: float
    maxV: float
    efficiency: float
    description: str
    type: str


#   price: float    just an idea :D

class Pump(Device):
    flow: float


class Light(Device):
    luminance: float
    brightness: float
    color: str


class Filter(Device):
    filter_type: str
    flow_max: float


class Heater(Device):
    min_temp: float
    max_temp: float
