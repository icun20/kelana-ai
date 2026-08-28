"use client";

import React, { useState, useEffect } from 'react';
import TripCard, { TripData } from '../../components/TripCard';

export default function Dashboard() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  
  const fetchTrips = () => {
    fetch("http://localhost:8000/api/v1/trips")
      .then(res => res.json())
      .then(data => {
        setTrips(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching trips:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrips();
    // Poll every 5 seconds to get updates if a card generates AI recommendation
    const interval = setInterval(fetchTrips, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTrips = trips.slice(startIndex, startIndex + itemsPerPage);

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

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading your trips...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No trips found. Go back home to generate one!</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
                <span className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(startIndex + itemsPerPage, trips.length)}</span> of <span className="font-semibold text-slate-900">{trips.length}</span> trips
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
          </>
        )}
      </div>
    </div>
  );
}
