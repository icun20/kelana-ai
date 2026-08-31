"use client";

import Link from "next/link";
import React, { useState } from "react";

import { API_BASE, getAuthHeaders } from "../lib/auth";

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
  japan: "🗼",
  tokyo: "🗼",
  france: "🗼",
  paris: "🗼",
  bali: "🏝️",
  indonesia: "🏝️",
  london: "🎡",
  uk: "🎡",
  "new york": "🗽",
  usa: "🗽",
};

const getDestinationIcon = (destination: string) => {
  const destLower = destination.toLowerCase();
  for (const [key, icon] of Object.entries(DESTINATION_ICONS)) {
    if (destLower.includes(key)) return icon;
  }
  return "📍";
};

const CATEGORY_STYLES: Record<string, string> = {
  backpacker: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  standard: "bg-blue-50 text-blue-700 ring-blue-600/20",
  luxury: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

const STYLE_STYLES: Record<string, string> = {
  family: "bg-amber-50 text-amber-700 ring-amber-600/20",
  solo: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  couple: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export default function TripCard({ trip }: { trip: TripData }) {
  const [aiRec, setAiRec] = useState<string | undefined>(trip.ai_recommendation);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const travelStyle = trip.travelStyle || "Solo";
  const categoryStyle = CATEGORY_STYLES[trip.category.toLowerCase()] || "bg-gray-50 text-gray-700 ring-gray-600/20";
  const travelStyleColor = STYLE_STYLES[travelStyle.toLowerCase()] || "bg-gray-50 text-gray-700 ring-gray-600/20";

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/trips/${trip.id}/generate`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setAiRec(data.ai_recommendation);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail || "Failed to generate itinerary. Check backend logs.");
      }
    } catch (error) {
      alert("Network error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
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

      <div className="mt-auto space-y-3">
        <div className="flex gap-2">
          <Link
            href={`/trips/${trip.id}`}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "✨ AI"}
          </button>
        </div>

        {aiRec ? (
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 relative">
            <div className="absolute -top-2 -left-1 text-xl">✨</div>
            <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-4 relative z-10 pl-2">{aiRec}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
