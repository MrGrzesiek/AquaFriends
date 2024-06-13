from fastapi import HTTPException


def validate_device(func):
    def wrapper(*args, **kwargs):
        device = args[0]
        if None in device.dict().values():
            raise HTTPException(status_code=400, detail="Missing device data")
        if device.name is None:
            raise HTTPException(status_code=400, detail="Missing device name")
        if device.device_types is None:
            raise HTTPException(status_code=400, detail="Missing device types")
        if device.minV < 10:
            raise HTTPException(status_code=400, detail="Device minV is less than expected aquarium volumes")
        if device.minV < device.maxV:
            raise HTTPException(status_code=400, detail="Device minV is greater Device maxV")
        if device.efficiency < 10:
            raise HTTPException(status_code=400, detail="Device is too inefficient or broken")

        return func(*args, **kwargs)

    return wrapper
