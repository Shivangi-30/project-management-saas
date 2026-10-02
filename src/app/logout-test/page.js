"use client";

import { useState } from "react";

export default function LogoutTest() {
  const [message, setMessage] = useState("");

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    const data = await response.json();

    setMessage(JSON.stringify(data, null, 2));
  }

  return (
    <main className="p-10">
      <h1 className="mb-4 text-2xl font-bold">
        Logout API Test
      </h1>

      <button
        onClick={handleLogout}
        className="rounded bg-red-600 px-4 py-2 text-white"
      >
        Logout User
      </button>

      <pre className="mt-6 whitespace-pre-wrap">
        {message}
      </pre>
    </main>
  );
}