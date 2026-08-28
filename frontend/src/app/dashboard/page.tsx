" use client";

import React, { useState } from 'react';
import TripCard, { TripData } from '../../components/TripCard';

const MOCK_TRIPS: TripData[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  destination: ['Tokyo', 'Paris', 'Bali', 'London', 'New York'][i % 5],
  days: (i % 7) + 3,
  budget: ((i % 5) + 1) * 1000,
  category: ['Backpacker', 'Standard', 'Luxury'][i % 3],
  daily_budget: (((i % 5) + 1) * 1000) / ((i % 7) + 3),
  travelStyle: ['Solo', 'Family', 'Couple'][i % 3],
  ai_recommendation: "Day 1: Exploring the city..."
}));

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(MOCK_TRIPS.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTrips = MOCK_TRIPS.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trip History Dashboard</h1>
          <p className="text-slate-500 mt-2">Review all your generated travel plans.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
            <span className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(startIndex + itemsPerPage, MOCK_TRIPS.length)}</span> of <span className="font-semibold text-slate-900">{MOCK_TRIPS.length}</span> trips
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
