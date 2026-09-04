from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)

    trips = relationship("Trip", back_populates="owner")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    daily_budget = Column(Float, nullable=False)
    ai_recommendation = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="trips")
    messages = relationship("Message", back_populates="trip", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(String, nullable=False)

    trip = relationship("Trip", back_populates="messages")
