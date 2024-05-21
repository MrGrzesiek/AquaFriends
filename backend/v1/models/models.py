from typing import List, Dict

from pydantic import BaseModel
import datetime


class ActiveSession(BaseModel):
    username: str
    access_token: str
    expiry_time: datetime.datetime


class Aquarium(BaseModel):
    id: int
    name: str
    dimensions: List[Dict[str, int]]
    components: List[Dict[str, int]]
