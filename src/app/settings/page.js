"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 pl-64">
      <Sidebar />

      <section className="min-h-screen">
        <Header />

        <div className="p-6">
          {/* Page Heading */}

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account and application settings.
            </p>
          </div>

          {/* Profile Settings */}

          <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Profile Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your basic profile information.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  defaultValue="Shivangi"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <input
                  type="text"
                  defaultValue="Frontend Developer"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>

          {/* Application Settings */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Application Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your application preferences.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-800">
                    Email Notifications
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Receive notifications about your projects and tasks.
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-800">
                    Task Reminders
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Get reminders for pending tasks.
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}