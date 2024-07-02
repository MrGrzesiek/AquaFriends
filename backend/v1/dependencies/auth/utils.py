from datetime import timedelta

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2AuthorizationCodeBearer, OAuth2PasswordBearer
from fastapi_login import LoginManager

import sys
from os import path
sys.path.append(path.join(path.dirname(__file__), '...'))
from models import User, UserCreate, UserInDB
from ..database import Connector

# Secret key for JWT
SECRET_KEY = "your_secret_key"

manager = LoginManager(SECRET_KEY, token_url='/auth/login', default_expiry=timedelta(minutes=600))
db_connector = Connector()


def get_user(username: str):
    print(f'Getting user: {username}')
    user = db_connector.get_users_collection().find_one({"username": username})
    if user:
        print(f'username: {user["username"]}, email: {user["email"]}, password: {user["password"]}, scopes: {user["scopes"]}')
        return UserInDB(username=user['username'], email=user['email'], password_hash=user['password'], scopes=user['scopes'])
    return None


def get_session():
    """
    fake function to simulate a session
    It's here because fastapi login manager requires session_provider, but doesn't use it
    """
    pass


@manager.user_loader(session_provider = get_session)
def load_user(email: str, session_provider):
    return get_user(email)


def __new_token(username: str):
    return manager.create_access_token(data=dict(sub=username))


def login(data: OAuth2PasswordRequestForm = Depends()):
    username = data.username
    password = data.password
    user = get_user(username)
    if not user or user.password_hash != password or user.username != username:
        raise HTTPException(status_code=400, detail=f'Invalid credentials.')

    return {'access_token': __new_token(username), 'token_type': 'bearer'}

# TODO: Implement token blacklisting
def refresh_token(user: User):
    return {'access_token': __new_token(user.username), 'token_type': 'bearer'}


def register(user: UserCreate):
    # TODO: Implement check for existing user
    scopes = None
    if '@aquafriends.com' in user.email:
        scopes = ['admin']
    else:
        scopes = ['user']

    new_user = {
        'username': user.username,
        'email': user.email,
        'password': user.password_hash,
        'aquariums': [],
        'scopes': scopes
    }
    db_connector.get_users_collection().insert_one(new_user)
    return {'code': 200, 'message': 'User created successfully'}

def get_current_user(user: User = Depends(manager.get_current_user)):
    return user


def get_current_active_user(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user


def get_admin_user(user: User = Depends(get_current_active_user)):
    if 'admin' not in user.scopes:
        print(f'User scopes: {user.scopes}')
        print(f'User contents: {user.dict()}')
        raise HTTPException(status_code=403, detail="Not enough permissions get_admin_user")
    return user
