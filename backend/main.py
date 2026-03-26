from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import uuid

from database import trip_collection, trip_helper
from models import TripRequest, ExpenseRequest, PackingListRequest, DestinationRequest, RuleBasedDestinationRequest, BudgetEstimateRequest, ItineraryModifyRequest
import services
import rule_based_recommendation

app = FastAPI(
    title="TravelSphere: Around the World in 80 Days",
    description="Vintage-themed smart travel management platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the TravelSphere Expedition API! Your journey begins here."}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "theme": "steampunk/vintage adventure"}

from typing import Any, Dict

# In-memory fallback if MongoDB is not running
mock_db: Dict[str, Any] = {}

@app.post("/plan-trip")
async def plan_trip(request: TripRequest, x_openrouter_api_key: str = Header(None)):
    itinerary = await services.generate_itinerary(
        destination=request.destination,
        days=request.days,
        interests=request.interests,
        budget=request.budget,
        currency=request.currency,
        custom_notes=request.custom_notes or "",
        api_key=x_openrouter_api_key
    )

    packing_list = await services.generate_packing_list(
        destination=request.destination,
        days=request.days,
        api_key=x_openrouter_api_key
    )

    trip_data = {
        "destination": request.destination,
        "budget": request.budget,
        "currency": request.currency,
        "days": request.days,
        "interests": request.interests,
        "travelers": request.travelers,
        "split_payment": request.split_payment,
        "custom_notes": request.custom_notes or "",
        "itinerary": itinerary,
        "packing_list": packing_list,
        "expenses": []
    }

    try:
        new_trip = await trip_collection.insert_one(trip_data)
        created_trip = await trip_collection.find_one({"_id": new_trip.inserted_id})
        return trip_helper(created_trip)
    except Exception as e:
        print(f"MongoDB Error, falling back to in-memory: {e}")
        trip_data.pop("_id", None)  # PyMongo may inject _id before timeout
        trip_id = str(uuid.uuid4())
        trip_data["id"] = trip_id
        mock_db[trip_id] = trip_data
        return trip_data

@app.get("/trips")
async def get_all_trips():
    trips = []
    try:
        cursor = trip_collection.find({})
        async for document in cursor:
            trips.append(trip_helper(document))
    except Exception:
        pass

    # Also include in-memory trips
    trips.extend(list(mock_db.values()))
    return trips

@app.get("/trip/{id}")
async def get_trip(id: str):
    try:
        if ObjectId.is_valid(id):
            trip = await trip_collection.find_one({"_id": ObjectId(id)})
            if trip:
                return trip_helper(trip)
    except Exception:
        pass

    if id in mock_db:
        return mock_db[id]

    raise HTTPException(status_code=404, detail="Trip not found")

@app.post("/expenses")
async def add_expense(request: ExpenseRequest):
    expense_data = {
        "category": request.expense.category,
        "amount": request.expense.amount,
        "description": request.expense.description
    }

    try:
        if ObjectId.is_valid(request.trip_id):
            update_result = await trip_collection.update_one(
                {"_id": ObjectId(request.trip_id)},
                {"$push": {"expenses": expense_data}}
            )
            if update_result.modified_count == 1:
                updated_trip = await trip_collection.find_one({"_id": ObjectId(request.trip_id)})
                return trip_helper(updated_trip)
    except Exception:
        pass

    if request.trip_id in mock_db:
        trip_doc = mock_db[request.trip_id]
        if "expenses" not in trip_doc or not isinstance(trip_doc["expenses"], list):
            trip_doc["expenses"] = []
        trip_doc["expenses"].append(expense_data)
        return trip_doc

    raise HTTPException(status_code=404, detail="Trip not found")

@app.post("/recommend-destination")
async def get_recommendations(request: DestinationRequest, x_openrouter_api_key: str = Header(None)):
    destinations = await services.recommend_destinations(request.preferences, request.budget, request.currency, api_key=x_openrouter_api_key)
    return {"recommendations": destinations}

@app.post("/estimate-budget")
async def estimate_budget_route(request: BudgetEstimateRequest, x_openrouter_api_key: str = Header(None)):
    estimated_amount = await services.estimate_budget(
        destination=request.destination,
        origin=request.origin,
        days=request.days,
        currency=request.currency,
        api_key=x_openrouter_api_key
    )
    return {"estimated_budget": estimated_amount}

@app.post("/api/recommend-destination/rule-based")
async def get_rule_based_recommendations(request: RuleBasedDestinationRequest):
    destinations_data = rule_based_recommendation.recommend_destinations(request.budget, request.interest, request.currency)
    return destinations_data

@app.get("/budget-summary/{id}")
async def get_budget_summary(id: str):
    trip: Dict[str, Any] | None = None
    try:
        if ObjectId.is_valid(id):
            doc = await trip_collection.find_one({"_id": ObjectId(id)})
            if doc:
                trip = dict(trip_helper(doc))
    except Exception:
        pass

    if not trip and id in mock_db:
        trip = mock_db[id]

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    expenses: list = trip.get("expenses", []) or []
    total_spent: float = float(sum(float(e.get("amount", 0)) for e in expenses if isinstance(e, dict)))
    remaining: float = float(trip.get("budget", 0)) - total_spent

    # Per-category breakdown
    category_breakdown: Dict[str, float] = {}
    for e in expenses:
        if isinstance(e, dict):
            cat = str(e.get("category", "Other"))
            category_breakdown[cat] = category_breakdown.get(cat, 0.0) + float(e.get("amount", 0))

    trip_data: Dict[str, Any] = trip if isinstance(trip, dict) else {}

    return {
        "trip_id": id,
        "destination": str(trip_data.get("destination", "")),
        "total_budget": float(trip_data.get("budget", 0)),
        "total_spent": float(f"{total_spent:.2f}"),
        "remaining": float(f"{remaining:.2f}"),
        "is_over_budget": remaining < 0,
        "expense_count": len(expenses),
        "category_breakdown": category_breakdown
    }

@app.get("/packing-list")
async def get_packing_list(destination: str, days: int, weather: str = "", x_openrouter_api_key: str = Header(None)):
    items = await services.generate_categorized_packing_list(destination, days, weather, api_key=x_openrouter_api_key)
    return items

@app.post("/modify-itinerary")
async def modify_itinerary_route(request: ItineraryModifyRequest, x_openrouter_api_key: str = Header(None)):
    result = await services.modify_itinerary(
        destination=request.destination,
        days=request.days,
        current_itinerary=request.current_itinerary,
        user_message=request.user_message,
        budget=request.budget,
        currency=request.currency,
        interests=request.interests,
        api_key=x_openrouter_api_key
    )
    return result
