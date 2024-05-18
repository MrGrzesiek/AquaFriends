from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from .models import UserInDB

manager = LoginManager("SecretWowWow", token_url='/dependencies/token')

fake_db = {
    'user1@example.com': {'password': 'password123'}
}


def get_user(email: str):
    user = fake_db.get(email)
    if user:
        return UserInDB(email=email, hashed_password=user['password'])
    return None


@manager.user_loader
def load_user(email: str):
    user = get_user(email)
    return user


def login(data: OAuth2PasswordRequestForm = Depends()):
    email = data.username
    password = data.password
    user = get_user(email)
    if not user or user.hashed_password != password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = manager.create_access_token(data=dict(sub=email))
    return {'access_token': access_token, 'token_type': 'bearer'}
