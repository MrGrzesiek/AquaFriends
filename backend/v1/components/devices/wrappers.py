from fastapi import HTTPException
from models import Pump, Filter, Light, Heater


def validate_device(func):
    def wrapper(*args, **kwargs):
        device = args[0]
        if None in device.dict().values():
            raise HTTPException(status_code=400, detail="Missing device data")

        if device.minV < 10:
            raise HTTPException(status_code=400, detail="Device minV is less than expected aquarium volumes")

        if device.minV > device.maxV:
            raise HTTPException(status_code=400, detail="Device minV is greater Device maxV")

        if device.efficiency < 10:
            raise HTTPException(status_code=400, detail="Device is too inefficient or broken")

        if isinstance(device, Pump):
            if device.flow <= 0:
                raise HTTPException(status_code=400, detail="Flow cannot be less than 0.1 ")

        elif isinstance(device, Light):
            if device.luminance <= 0:
                raise HTTPException(status_code=400, detail="Luminance cannot be less than 0.1")

            if device.brightness <= 0:
                raise HTTPException(status_code=400, detail="Brightness cannot be less than 1")

        elif isinstance(device, Filter):
            if device.flow_max <= 0.1:
                raise HTTPException(status_code=400, detail="Flow cant be less than 0.1 ")

        elif isinstance(device, Heater):
            if device.min_temperature <= 1:
                raise HTTPException(status_code=400, detail="Minimum temperature cannot be less than 1")

            if device.max_temperature >= 100:
                raise HTTPException(status_code=400, detail="Maximum temperature cannot be greater than 100")

            if device.min_temperature > device.max_temperature:
                raise HTTPException(status_code=400, detail="Minimum temperature exceeds maximum temperature")

        else:
            raise HTTPException(status_code=400, detail="Non standard device type")
        return func(*args, **kwargs)

    return wrapper
