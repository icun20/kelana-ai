"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthGuard from "../../components/AuthGuard";
import TripCard, { TripData } from "../../components/TripCard";
import { API_BASE, getAuthHeaders, logoutUser } from "../../lib/auth";

function DashboardContent() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Traveler");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const [tripsResponse, profileResponse] = await Promise.all([
          fetch(`${API_BASE}/api/v1/trips`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${API_BASE}/api/v1/me`, {
            headers: getAuthHeaders(),
          }),
        ]);

        if (tripsResponse.ok) {
          const data = await tripsResponse.json();
          setTrips(data.sort((a: TripData, b: TripData) => b.id - a.id));
        } else {
          const error = await tripsResponse.json().catch(() => ({}));
          alert(error.detail || "Unable to load your trips.");
          logoutUser(router);
          return;
        }

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserName(profileData.name || "Traveler");
        }
      } catch (error) {
        console.error("Failed to fetch trips", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [router]);

  const totalPages = Math.ceil(trips.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTrips = trips.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          Kelana<span className="text-rose-600">AI</span>
        </h1>
        <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">Planner</Link>
          <Link href="/dashboard" className="text-rose-600 transition-colors">Dashboard</Link>
          <Link href="/profile" className="hover:text-slate-900 transition-colors">Profile</Link>
          <button
            type="button"
            onClick={() => logoutUser(router)}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-slate-200"
          >
            Logout · {userName}
          </button>
        </nav>
      </header>

      <main className="flex-grow p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Journeys</h2>
            <p className="text-slate-500 mt-1">Review and manage your AI-generated travel itineraries.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all"
          >
            + Create New Plan
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-5xl mb-4 block">✈️</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No itineraries found</h3>
            <p className="text-slate-500 mb-6">You haven't planned any trips yet.</p>
            <Link
              href="/"
              className="inline-flex rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition-all"
            >
              Start Planning
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
