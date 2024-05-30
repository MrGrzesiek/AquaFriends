from fastapi import HTTPException

from .dependencies import manager


def login_required(func):
    def wrapper(*args, **kwargs):
        if not manager.get_current_user():
            raise HTTPException(status_code=401, detail="Not authenticated")
        return func(*args, **kwargs)

    return wrapper

def admin_required(func):
    def wrapper(*args, **kwargs):
        user = manager.get_current_user()
        if not user or 'admin' not in user.scopes:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return func(*args, **kwargs)

    return wrapper
