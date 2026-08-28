import React from 'react';

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

const getDestinationIcon = (destination: string) => {
  const destLower = destination.toLowerCase();
  if (destLower.includes('japan') || destLower.includes('tokyo')) return '👼';
  if (destLower.includes('france') || destLower.includes('paris')) return '👼'; 
  if (destLower.includes('bali') || destLower.includes('indonesia')) return '🏝️&#65039;';
  if (destLower.includes('london')) return '🎡';
  if (destLower.includes('new york')) return '�勽';
  return '📍';
};

const getCategoryBadgeColor = (category: string) => {
  const catLower = category.toLowerCase();
  if (catLower === 'backpacker') return 'bg-green-100 text-green-800 border-green-300';
  if (catLower === 'standard') return 'bg-blue-100 text-blue-800 border-blue-300';
  if (catLower === 'luxury') return 'bg-purple-100 text-purple-800 border-purple-300';
  return 'bg-gray-100 text-gray-800 border-gray-300';
};

const getStyleBadgeColor = (style: string) => {
  const styleLower = style.toLowerCase();
  if (styleLower === 'family') return 'bg-orange-100 text-orange-800';
  if (styleLower === 'solo') return 'bg-teal-100 text-teal-800';
  if (styleLower === 'couple') return 'bg-pink-100 text-pink-800';
  return 'bg-gray-100 text-gray-800';
};

export default function TripCard({ trip }: { trip: TripData }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const style = trip.travelStyle || 'Solo'; 
  return (
    <div className="border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="text-2xl">{getDestinationIcon(trip.destination)}</span>
          {trip.destination}
        </h3>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeColor(trip.category)}`}>
          {trip.category}
        </span>
      </div>

      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span className="font-medium">Duration:</span>
          <span>{trip.days} Days</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span className="font-medium">Total Budget:</span>
          <span className="font-bold text-slate-800">{formatCurrency(trip.budget)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span className="font-medium">Daily Budget:</span>
          <span>{formatCurrency(trip.daily_budget)} / day</span>
        </div>
      </div>

      <div className="mb-4">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${getStyleBadgeColor(style)}`}>
          {style} Trip
        </span>
      </div>

      {trip.ai_recommendation && (
        <div className="mt-auto pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 line-clamp-3 italic">
            "{trip.ai_recommendation}"
          </p>
        </div>
      )}
    </div>
  );
}
