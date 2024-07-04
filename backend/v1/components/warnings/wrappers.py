from fastapi import HTTPException


def validate_warning(func):
    def wrapper(*args, **kwargs):
        warning = args[0]

        # checks below:

        return func(*args, **kwargs)

    return wrapper