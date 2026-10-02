"use client";

import { useState } from "react";

export default function LoginTest() {
  const [message, setMessage] = useState("");

  async function handleLogin() {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        Login API Test
      </h1>

      <button
        onClick={handleLogin}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Login User
      </button>

      <pre className="mt-6 whitespace-pre-wrap">
        {message}
      </pre>
    </main>
  );
}