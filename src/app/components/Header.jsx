"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header({ onMenuClick = () => {} }) {
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

  const pageTitle =
    pageTitles[pathname] ||
    (pathname.startsWith("/projects/") ? "Project Details" : "Dashboard");

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

      if (response.ok && data.success) {
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
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-6">
      {/* Page title and mobile menu */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">
            {pageTitle}
          </h1>

          <p className="hidden text-sm text-slate-500 sm:block">
            Welcome back! Here is your project overview.
          </p>
        </div>
      </div>

      {/* User profile and logout */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {userInitials}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-40 truncate text-sm font-medium text-slate-800">
              {loading ? "Loading..." : user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role === "admin" ? "Admin" : "Frontend Developer"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="whitespace-nowrap rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}