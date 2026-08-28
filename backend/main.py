from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Trip
from services.bedrock_service import generate_ai_recommendation
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KelanaAI",
    description="Layanan web KelanaAI - Travel AI Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class TripCreate(BaseModel):
    destination: str
    days: int
    budget: float


class TripUpdate(BaseModel):
    budget: float


class TripResponse(BaseModel):
    id: int
    destination: str
    days: int
    budget: float
    category: str
    daily_budget: float
    ai_recommendation: str | None = None

    class Config:
        from_attributes = True


@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


@app.post("/api/v1/trips", response_model=TripResponse)
def create_trip(trip_data: TripCreate, db: Session = Depends(get_db)):
    category = get_trip_category(trip_data.budget)
    daily_budget = calculate_daily_budget(trip_data.budget, trip_data.days)

    new_trip = Trip(
        destination=trip_data.destination,
        days=trip_data.days,
        budget=trip_data.budget,
        category=category,
        daily_budget=daily_budget,
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip


@app.get("/api/v1/trips", response_model=list[TripResponse])
def get_all_trips(db: Session = Depends(get_db)):
    return db.query(Trip).all()


@app.get("/api/v1/trips/{id}", response_model=TripResponse)
def get_trip_by_id(id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@app.put("/api/v1/trips/{id}", response_model=TripResponse)
def update_trip(id: int, trip_data: TripUpdate, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.budget = trip_data.budget
    trip.category = get_trip_category(trip_data.budget)
    trip.daily_budget = calculate_daily_budget(trip_data.budget, trip.days)

    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/api/v1/trips/{id}")
def delete_trip(id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    db.delete(trip)
    db.commit()
    return {"detail": "Trip deleted successfully"}



@app.post("/api/v1/trips/{id}/generate", response_model=TripResponse)
def generate_trip_recommendation(id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    recommendation = generate_ai_recommendation(trip.destination, trip.days)
    trip.ai_recommendation = recommendation
    db.commit()
    db.refresh(trip)
    return trip

if __name__ == "__main__":
    # CLI mode
    destination = input("Enter destination: ")
    days = int(input("Enter number of days: "))
    budget = float(input("Enter budget (USD): "))
    travel_month = input("Enter travel month: ")

    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)
    season = get_travel_season(travel_month)
    places = get_recommended_places(destination)

    print()
    print(f"Destination     : {destination}")
    print(f"Days            : {days}")
    print(f"Budget          : {int(budget)} USD")
    print(f"Category        : {category}")
    print(f"Daily Budget    : {int(daily_budget)} USD/Day")
    print(f"Travel Month    : {travel_month}")
    print(f"Season          : {season}")
    print()
    print("Recommended Places")
    for place in places:
        print(f"  - {place}")
