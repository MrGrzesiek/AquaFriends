import json
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi_login import LoginManager

from dependencies.auth.routes import router as auth_router
from components.aquariums.routes import router as aquariums_router
from dependencies.database import Connector

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5137"],  # Ustaw domenę Twojej aplikacji klienta
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Dodaj metody HTTP, które chcesz obsługiwać
    allow_headers=["*"],  # Ustaw nagłówki, które chcesz zezwolić
)

# Routers
app.include_router(auth_router)
app.include_router(aquariums_router)

# DB connection
config = json.load(open("config.json"))
db_connector = Connector(config['MONGO_API_KEY'])

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)

@app.get("/")
async def root():
    return {"message": "Hello World"}