import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_DETAILS, serverSelectionTimeoutMS=3000)
database = client.travelsphere

trip_collection = database.get_collection("trips")
user_collection = database.get_collection("users")
expense_collection = database.get_collection("expenses")


def trip_helper(trip) -> dict:
    """Convert a MongoDB document into a clean response dict."""
    doc = dict(trip)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc
