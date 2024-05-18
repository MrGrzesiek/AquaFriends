from pydantic import BaseModel
from typing import List


class User(BaseModel):
    email: str
    scopes: List[str]

class UserInDB(User):
    email: str
    hashed_password: str


