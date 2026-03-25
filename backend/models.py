from pydantic import BaseModel, Field, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing import List, Optional, Any, Annotated
from datetime import datetime, timezone


PyObjectId = Annotated[str, BeforeValidator(str)]

class TripRequest(BaseModel):
    destination: str
    budget: float
    currency: str = "USD"
    days: int
    interests: List[str]
    travelers: int = 1
    split_payment: bool = False

class Expense(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None

class TripResponse(BaseModel):
    id: PyObjectId = Field(default_factory=str, alias="_id")
    destination: str
    budget: float
    currency: str = "USD"
    days: int
    interests: List[str]
    travelers: int = 1
    split_payment: bool = False
    itinerary: List[Any] = Field(default_factory=list)
    packing_list: List[str] = Field(default_factory=list)
    expenses: List[Expense] = Field(default_factory=list)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class ExpenseRequest(BaseModel):
    trip_id: str
    expense: Expense

class PackingListRequest(BaseModel):
    destination: str
    days: int

class DestinationRequest(BaseModel):
    preferences: List[str]
    budget: float
    currency: str = "USD"

class RuleBasedDestinationRequest(BaseModel):
    budget: float
    interest: str
    currency: str = "USD"

class BudgetEstimateRequest(BaseModel):
    destination: str
    origin: str
    days: int
    currency: str = "USD"

# --- MongoDB Schemas ---

class UserDB(BaseModel):
    id: PyObjectId = Field(default_factory=str, alias="_id")
    email: str
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class ExpenseDB(BaseModel):
    id: PyObjectId = Field(default_factory=str, alias="_id")
    trip_id: str
    user_id: str
    category: str
    amount: float
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class TripDB(BaseModel):
    id: PyObjectId = Field(default_factory=str, alias="_id")
    user_id: str
    destination: str
    budget: float
    days: int
    interests: List[str] = Field(default_factory=list)
    travelers: int = 1
    split_payment: bool = False
    generated_itinerary: List[Any] = Field(default_factory=list)
    expenses: List[ExpenseDB] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
