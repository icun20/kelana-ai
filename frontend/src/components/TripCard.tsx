"use client";

import React, { useState } from 'react';

export interface TripData {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation?: string;
  travelStyle?: string;
}

const DESTINATION_ICONS: Record<string, string> = {
  japan: '🗼', tokyo: '🗼',
  france: '🗼', paris: '🗼',
  bali: '🏝️', indonesia: '🏝️',
  london: '🎡', uk: '🎡',
  'new york': '🗽', usa: '🗽',
};

const getDestinationIcon = (destination: string) => {
  const destLower = destination.toLowerCase();
  for (const [key, icon] of Object.entries(DESTINATION_ICONS)) {
    if (destLower.includes(key)) return icon;
  }
  return '📍';
};

const CATEGORY_STYLES: Record<string, string> = {
  backpacker: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  standard: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  luxury: 'bg-purple-50 text-purple-700 ring-purple-600/20',
};

const STYLE_STYLES: Record<string, string> = {
  family: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  solo: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
  couple: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export default function TripCard({ trip }: { trip: TripData }) {
  const [aiRec, setAiRec] = useState<string | undefined>(trip.ai_recommendation);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const travelStyle = trip.travelStyle || 'Solo';
  const categoryStyle = CATEGORY_STYLES[trip.category.toLowerCase()] || 'bg-gray-50 text-gray-700 ring-gray-600/20';
  const travelStyleColor = STYLE_STYLES[travelStyle.toLowerCase()] || 'bg-gray-50 text-gray-700 ring-gray-600/20';

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/trips/${trip.id}/generate`, {
        method: "POST"
      });
      if (response.ok) {
        const data = await response.json();
        setAiRec(data.ai_recommendation);
      } else {
        alert("Failed to generate itinerary. Check backend logs.");
      }
    } catch (error) {
      alert("Network error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
      
      {/* Header section */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="icon">
              {getDestinationIcon(trip.destination)}
            </span>
            {trip.destination}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${categoryStyle}`}>
              {trip.category}
            </span>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${travelStyleColor}`}>
              {travelStyle}
            </span>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="mb-6 space-y-3 flex-grow border-y border-slate-50 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Duration</span>
          <span className="font-semibold text-slate-700">{trip.days} Days</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Total Budget</span>
          <span className="font-semibold text-slate-900">{formatCurrency(trip.budget)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Daily Average</span>
          <span className="font-semibold text-slate-700">{formatCurrency(trip.daily_budget)} / day</span>
        </div>
      </div>

      {/* Footer / AI section */}
      <div className="mt-auto">
        {aiRec ? (
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 relative">
            <div className="absolute -top-2 -left-1 text-xl">✨</div>
            <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-4 relative z-10 pl-2">
              {aiRec}
            </p>
          </div>
        ) : (
          <button 
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : (
              '✨ Generate AI Itinerary'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
