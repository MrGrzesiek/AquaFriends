from fastapi import HTTPException
from models import Warning


def validate_warning(func):
    def wrapper(*args, **kwargs):
        warning: Warning = args[0]

        # checks below:
        if not warning:
            raise HTTPException(status_code=400, detail="Warning data is required")

        if len(warning.warning_name) < 5:
            raise HTTPException(status_code=400, detail="Warning name must be at least 5 characters long")

        if len(warning.warning_description) < 10:
            raise HTTPException(status_code=400, detail="Warning description must be at least 10 characters long")

        if warning.parameter not in ['temperature', 'ph', 'No2', 'No3', 'GH', 'KH']:
            raise HTTPException(status_code=400, detail="Parameter must be one of: temperature, ph, No2, No3, GH, KH")

        match warning.parameter:
            case 'temperature':
                if warning.min_value < 0 or warning.max_value > 100:
                    raise HTTPException(status_code=400, detail="Temperature must be between 0 and 100 degrees Celsius")
            case 'ph':
                if warning.min_value < 0 or warning.max_value > 14:
                    raise HTTPException(status_code=400, detail="ph must be between 0 and 14")
            case 'No2', 'No3', 'GH', 'KH':
                if warning.min_value < 0:
                    raise HTTPException(status_code=400, detail=f"{warning.parameter} cannot be negative")

        if warning.min_value > warning.max_value:
            raise HTTPException(status_code=400, detail="Minimum value must be less than maximum value")

        return func(*args, **kwargs)

    return wrapper