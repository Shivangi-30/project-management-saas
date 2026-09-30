"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">
      
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-700 px-6">
        <h1 className="text-xl font-bold">
          Project SaaS
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <div className="space-y-2">

          <Link
            href="/dashboard"
            className="block rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium hover:bg-slate-700"
          >
            Dashboard
          </Link>

          <Link
            href="/projects"
            className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Projects
          </Link>

          <Link
            href="/tasks"
            className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Tasks
          </Link>

          <Link
            href="/settings"
            className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Settings
          </Link>

        </div>
      </nav>

    </aside>
  );
}