from pydantic import BaseModel
from typing import List


class User(BaseModel):
    email: str
    scopes: List[str]

class UserInDB(User):
    username: str
    email: str
    password_hash: str

class UserCreate(BaseModel):
    username: str
    password_hash: str
    email: str


