from fastapi import FastAPI
from contextlib import asynccontextmanager
from backend.settings import settings
import backend.api as api
import backend.db as db


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

app.include_router(api.graphql_router, prefix="/graphql")


@app.get("/health", tags=["System"])
def health_check():
    return {
        "system": "Fudan Bestcom Backend",
        "status": "online",
        "debug": settings.debug,
    }
