from fastapi import HTTPException


def validate_aquarium(func):
    def wrapper(*args, **kwargs):
        aquarium = args[0]
        if None in aquarium.dict().values():
            raise HTTPException(status_code=400, detail="Missing aquarium data")

        if aquarium.name is None:
            raise HTTPException(status_code=400, detail="Missing aquarium name")

        if aquarium.temperature <= 0 or aquarium.temperature >= 100:
            raise HTTPException(status_code=400, detail="Temperature must be between 0 and 100 degrees Celsius")

        if aquarium.width <= 5:
            raise HTTPException(status_code=400, detail="Width is negative")

        if aquarium.height <= 5:
            raise HTTPException(status_code=400, detail="Height is negative")

        if aquarium.length <= 5:
            raise HTTPException(status_code=400, detail="Length is negative")

        if aquarium.ph >= 8 or aquarium.ph <= 2:
            raise HTTPException(status_code=400, detail="pH cannot be more than 8 and less than 2")

        if aquarium.No2 < 0:
            raise HTTPException(status_code=400, detail="N02 cannot be negative")

        if aquarium.No3 < 0:
            raise HTTPException(status_code=400, detail="No3 cannot be negative")

        if aquarium.GH < 0:
            raise HTTPException(status_code=400, detail="GH cannot be negative")

        if aquarium.KH < 0:
            raise HTTPException(status_code=400, detail="KH cannot be negative")

        return func(*args, **kwargs)

    return wrapper
