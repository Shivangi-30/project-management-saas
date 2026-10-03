"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/tasks": "Tasks",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Fetch User Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/auth/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          {pageTitle}
        </h1>

        <p className="text-sm text-slate-500">
          Welcome back! Here is your project overview.
        </p>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700">
            {userInitials}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              {loading ? "Loading..." : user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role === "admin"
                ? "Admin"
                : "Frontend Developer"}
            </p>
          </div>

        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>

      </div>
    </header>
  );
}