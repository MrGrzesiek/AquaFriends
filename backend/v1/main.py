import json
from fastapi import FastAPI, Request
import uvicorn
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi_login import LoginManager
from fastapi.responses import JSONResponse

from dependencies.auth.routes import router as auth_router
from components.aquariums import router as aquariums_router
from components.fishes import router as fishes_routes
from components.devices import router as devices_routes
from components.warnings import router as warnings_routes
from dependencies.database import Connector

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    #logging.error(f"{request}: {exc_str}")
    print(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=422)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5137", "http://localhost:3000", "http://localhost:3001"],  # Ustaw domenę Twojej aplikacji klienta
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Dodaj metody HTTP, które chcesz obsługiwać
    allow_headers=["*"],  # Ustaw nagłówki, które chcesz zezwolić
)

# Routers
app.include_router(auth_router)
app.include_router(aquariums_router)
app.include_router(fishes_routes)
app.include_router(devices_routes)
app.include_router(warnings_routes)

# DB connection
config = json.load(open("config.json"))
db_connector = Connector(config['MONGO_API_KEY'])

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)

@app.get("/")
async def root():
    return {"message": "Hello World"}