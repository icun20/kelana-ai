"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AuthGuard from "../components/AuthGuard";
import { API_BASE, getAuthHeaders, getStoredToken, logoutUser } from "../lib/auth";

function PlannerPageContent() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("Traveler");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/me`, {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name || "Traveler");
        }
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || days <= 0 || budget <= 0) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ destination, days, budget }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail || "Failed to create trip.");
      }
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          Kelana<span className="text-rose-600">AI</span>
        </h1>
        <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <Link href="/" className="text-rose-600 transition-colors">Planner</Link>
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
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

      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto">
        <div className="w-full flex flex-col md:flex-row gap-8 items-stretch">
          <div className="flex-1 relative rounded-3xl overflow-hidden shadow-xl min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200&h=800"
              alt="Travel destination"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-white text-4xl font-bold tracking-tight mb-2">Craft Your Perfect Trip</h2>
              <p className="text-slate-200 text-sm">Let AI design your day-by-day itinerary based on your preferences.</p>
            </div>
          </div>

          <div className="w-full md:w-[400px] bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Where to?</h3>
              <p className="text-sm text-slate-500">Fill the details and let KelanaAI handle the rest.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="destination" className="block text-sm font-semibold text-slate-700">Destination</label>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="days" className="block text-sm font-semibold text-slate-700">Days</label>
                  <input
                    type="number"
                    id="days"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    min="1"
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="budget" className="block text-sm font-semibold text-slate-700">Budget ($)</label>
                  <input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min="1"
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating...
                  </>
                ) : (
                  "Generate Itinerary"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-400 border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} KelanaAI Network. Designed by Icun.
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <PlannerPageContent />
    </AuthGuard>
  );
}
