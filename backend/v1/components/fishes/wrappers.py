from fastapi import HTTPException


def validate_species(func):
    def wrapper(*args, **kwargs):
        species = args[0]
        if None in species.dict().values():
            raise HTTPException(status_code=400, detail="Missing species data")

        if species.min_temp > species.max_temp:
            raise HTTPException(status_code=400, detail="Minimum temperature must be less than maximum temperature")

        if  species.min_temp < 0 or species.max_temp > 100:
            raise HTTPException(status_code=400, detail="Temperature must be between 0 and 100 degrees Celsius")

        if species.min_ph > species.max_ph:
            raise HTTPException(status_code=400, detail="Minimum pH must be less than maximum pH")

        if species.min_ph < 0 or species.max_ph > 14:
            raise HTTPException(status_code=400, detail="pH must be between 0 and 14")

        if species.min_salinity > species.max_salinity:
            raise HTTPException(status_code=400, detail="Minimum salinity must be less than maximum salinity")

        if species.min_salinity < 0 or species.max_salinity > 100:
            raise HTTPException(status_code=400, detail="Salinity must be between 0 and 100 percent")

        return func(*args, **kwargs)

    return wrapper