"use client";

import { useState } from "react";

export default function RegisterTest() {
  const [message, setMessage] = useState("");

  async function handleRegister() {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Shivangi",
        email: "shivangi@test.com",
        password: "test1234",
      }),
    });

    const data = await response.json();

    setMessage(JSON.stringify(data, null, 2));
  }

  return (
    <main className="p-10">
      <h1 className="mb-4 text-2xl font-bold">
        Register API Test
      </h1>

      <button
        onClick={handleRegister}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Register User
      </button>

      <pre className="mt-6 whitespace-pre-wrap">
        {message}
      </pre>
    </main>
  );
}