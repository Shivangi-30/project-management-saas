"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/tasks": "Tasks",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

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

      <div className="flex items-center gap-3">
        
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700">
          SG
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">
            Shivangi
          </p>

          <p className="text-xs text-slate-500">
            Frontend Developer
          </p>
        </div>

      </div>

    </header>
  );
}