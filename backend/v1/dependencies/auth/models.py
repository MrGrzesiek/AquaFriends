from pydantic import BaseModel
from typing import List


class User(BaseModel):
    email: str


class UserInDB(User):
    hashed_password: str


class User(BaseModel):
    email: str
    scopes: List[str]
