"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AuthGuard from "../../components/AuthGuard";
import { API_BASE, getAuthHeaders, logoutUser } from "../../lib/auth";

function ProfileContent() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/me`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          logoutUser(router);
          return;
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Profile</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{profile.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => logoutUser(router)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
