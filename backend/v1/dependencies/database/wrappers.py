from models import Aquarium
from .database_connector import Connector
from fastapi import HTTPException

db_connector = Connector()


def log_aquarium_history(func):
    def wrapper(*args, **kwargs):
        aquarium = args[0]
        if not isinstance(aquarium, Aquarium):
            raise HTTPException(status_code=400, detail="Aquarium is of invalid type in log_aquarium_history")

        db_connector.log_aquarium(aquarium)

        # Get the current aquarium data
        return func(*args, **kwargs)

    return wrapper
