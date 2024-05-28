from typing import List, Dict

from pydantic import BaseModel
import datetime


class ActiveSession(BaseModel):
    username: str
    access_token: str
    expiry_time: datetime.datetime


class Aquarium(BaseModel):
    '''
    Class used to represent an aquarium in the database
    '''
    id: int
    name: str
    dimensions: List[Dict[str, int]]
    components: List[Dict[str, int]]


class User(BaseModel):
    '''
    Class used for authentication purposes with login manager
    '''
    email: str
    scopes: List[str]


class UserInDB(User):
    '''
    Class used to represent a user in the database
    '''
    username: str
    email: str
    password_hash: str
    scopes: List[str]


class UserCreate(BaseModel):
    '''
    Class usages:
    - User registration
    - Registration request body validation
    '''
    username: str
    password_hash: str
    email: str

