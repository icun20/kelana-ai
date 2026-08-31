"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { API_BASE, setStoredToken } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("Adit");
  const [email, setEmail] = useState("adit@example.com");
  const [password, setPassword] = useState("secret123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      setStoredToken(data.token);
      router.push("/");
    } catch (error) {
      alert("Unable to register: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Join KelanaAI and save your personal trips.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700 disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-rose-600 hover:text-rose-700">Login</Link>
        </p>
      </div>
    </div>
  );
}
