import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Trip, User, Message
from services.bedrock_service import generate_ai_recommendation, generate_chat_response
from services.trip_service import (
    calculate_daily_budget,
    get_recommended_places,
    get_trip_category,
    get_travel_season,
)

load_dotenv()

Base.metadata.create_all(bind=engine)

SECRET_KEY = os.getenv("SECRET_KEY", "kelana-ai-dev-secret-key")
ALGORITHM = "HS256"
security_scheme = HTTPBearer(auto_error=False)

app = FastAPI(
    title="KelanaAI",
    description="Layanan web KelanaAI - Travel AI Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: str

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


class TokenResponse(BaseModel):
    token: str
    user: UserResponse


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
    user_id: int

    class Config:
        from_attributes = True


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


@app.post("/api/v1/auth/register", response_model=TokenResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    email = user_data.email.strip().lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user = User(
        name=user_data.name.strip(),
        email=email,
        hashed_password=hash_password(user_data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user)
    return {
        "token": token,
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    email = user_data.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user)
    return {
        "token": token,
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.get("/api/v1/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/api/v1/trips", response_model=TripResponse)
def create_trip(
    trip_data: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = get_trip_category(trip_data.budget)
    daily_budget = calculate_daily_budget(trip_data.budget, trip_data.days)

    new_trip = Trip(
        destination=trip_data.destination,
        days=trip_data.days,
        budget=trip_data.budget,
        category=category,
        daily_budget=daily_budget,
        user_id=current_user.id,
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip


@app.get("/api/v1/trips", response_model=list[TripResponse])
def get_all_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Trip).filter(Trip.user_id == current_user.id).all()


@app.get("/api/v1/trips/{id}", response_model=TripResponse)
def get_trip_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this trip")
    return trip


@app.put("/api/v1/trips/{id}", response_model=TripResponse)
def update_trip(
    id: int,
    trip_data: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this trip")

    trip.budget = trip_data.budget
    trip.category = get_trip_category(trip_data.budget)
    trip.daily_budget = calculate_daily_budget(trip_data.budget, trip.days)

    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/api/v1/trips/{id}")
def delete_trip(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this trip")

    db.delete(trip)
    db.commit()
    return {"detail": "Trip deleted successfully"}


@app.post("/api/v1/trips/{id}/generate", response_model=TripResponse)
def generate_trip_recommendation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this trip")

    recommendation = generate_ai_recommendation(trip.destination, trip.days)
    trip.ai_recommendation = recommendation
    db.commit()
    db.refresh(trip)
    return trip



@app.get("/api/v1/trips/{id}/chat", response_model=list[MessageResponse])
def get_trip_chat(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this trip")
    
    return db.query(Message).filter(Message.trip_id == trip.id).order_by(Message.id.asc()).all()

@app.post("/api/v1/trips/{id}/chat", response_model=MessageResponse)
def create_trip_chat(
    id: int,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this trip")
    
    now = datetime.now().isoformat()
    user_msg = Message(trip_id=trip.id, role="user", content=message_data.content, created_at=now)
    db.add(user_msg)
    db.commit()
    
    db.refresh(user_msg)
    
    # Fetch history up to this point (excluding the new user msg we just saved)
    history = db.query(Message).filter(Message.trip_id == trip.id, Message.id < user_msg.id).order_by(Message.id.asc()).all()
    
    # Generate AI response via Bedrock
    ai_content = generate_chat_response(history, message_data.content, trip.destination)
    ai_msg = Message(trip_id=trip.id, role="assistant", content=ai_content, created_at=datetime.now().isoformat())
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    return ai_msg

if __name__ == "__main__":
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

