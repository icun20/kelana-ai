"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getStoredToken } from "../lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    const publicRoutes = ["/login", "/register"];

    if (!token && !publicRoutes.includes(pathname)) {
      router.replace("/login");
      return;
    }

    if (token && publicRoutes.includes(pathname)) {
      router.replace("/");
      return;
    }

    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="rounded-xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
