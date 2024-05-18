from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:7999"],  # Ustaw domenę Twojej aplikacji klienta
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Dodaj metody HTTP, które chcesz obsługiwać
    allow_headers=["*"],  # Ustaw nagłówki, które chcesz zezwolić
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/")
async def root():
    return {"message": "Hello World"}