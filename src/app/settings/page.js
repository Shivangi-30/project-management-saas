"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");

  // Change Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/auth/me");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch user"
          );
        }

        setUser(data.user);
        setName(data.user.name || "");
      } catch (error) {
        console.error("Fetch User Error:", error);

        setError(
          error.message || "Failed to fetch user"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function handleSaveChanges() {
    if (!name.trim()) {
      setError("Name is required.");
      setMessage("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setUser(data.user);
      setName(data.user.name || "");

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Update Profile Error:", error);

      setError(
        error.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    setError("");
    setMessage("");

    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }

    if (!newPassword) {
      setError("New password is required.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        "/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change password"
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      setError(
        error.message || "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  }

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

          {/* Messages */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {message}
            </div>
          )}

          {/* Profile Settings */}
          <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Profile Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your basic profile information.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  value={loading ? "Loading..." : name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  disabled={loading || saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <input
                  type="text"
                  value={
                    loading
                      ? "Loading..."
                      : user?.role === "admin"
                      ? "Admin"
                      : "Frontend Developer"
                  }
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none"
                />
              </div>

            </div>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={loading || saving}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Change Password */}
          <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your account password.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {/* Current Password */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  disabled={changingPassword}
                  placeholder="Enter your current password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  disabled={changingPassword}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  disabled={changingPassword}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changingPassword
                ? "Changing Password..."
                : "Change Password"}
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

              {/* Email Notifications */}
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

              {/* Task Reminders */}
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