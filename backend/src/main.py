from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from settings import settings
import api
import db


# This function dictates what happens when the server turns on and off
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC ---
    print("Booting up server...")
    if settings.debug:
        print("Debug Mode Enabled")
    db.setup()

    yield  # This yields control back to FastAPI to actually run the API

    # --- SHUTDOWN LOGIC ---
    print("Shutting down server...")


app = FastAPI(
    title="Schema",
    description="Campus Route Planner",
    version="1.0.0",
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.graphql_router, prefix="/graphql")


@app.get("/health", tags=["System"])
def health_check():
    return {
        "system": "Fudan Bestcom Backend",
        "status": "online",
        "debug": settings.debug,
    }
