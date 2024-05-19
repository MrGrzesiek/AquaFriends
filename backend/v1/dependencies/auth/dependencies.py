from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2AuthorizationCodeBearer, OAuth2PasswordBearer
from fastapi_login import LoginManager
from .models import UserInDB, User

# Secret key for JWT
SECRET_KEY = "your_secret_key"

manager = LoginManager(SECRET_KEY, token_url='/auth/login')

fake_db = {
    'user1@example.com': {'password': 'password123', 'scopes': ['user']},
    'admin@example.com': {'password': 'adminpassword', 'scopes': ['admin']}
}

def get_session():
    yield fake_db

def get_user(email: str):
    user = fake_db.get(email)
    if user:
        return UserInDB(email=email, hashed_password=user['password'], scopes=user['scopes'])
    return None

@manager.user_loader(session_provider = get_session)
def load_user(email: str, session_provider):
    return get_user(email)


def login(data: OAuth2PasswordRequestForm = Depends()):
    email = data.username
    password = data.password
    user = get_user(email)
    if not user or user.hashed_password != password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = manager.create_access_token(data=dict(sub=email))
    return {'access_token': access_token, 'token_type': 'bearer'}


def get_current_user(user: User = Depends(manager.get_current_user)):
    return user


def get_current_active_user(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user


def get_admin_user(user: User = Depends(get_current_active_user)):
    if 'admin' not in user.scopes:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user