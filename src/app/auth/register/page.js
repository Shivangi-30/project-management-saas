"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

function handleSubmit(event) {
  event.preventDefault();

  setError("");

  if (!formData.name.trim()) {
    setError("Name is required");
    return;
  }

  if (!formData.email.trim()) {
    setError("Email is required");
    return;
  }

  if (!formData.password) {
    setError("Password is required");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  console.log(formData);
}
async function handleSubmit(event) {
  event.preventDefault();

  setError("");

  if (!formData.name.trim()) {
    setError("Name is required");
    return;
  }

  if (!formData.email.trim()) {
    setError("Email is required");
    return;
  }

  if (!formData.password) {
    setError("Password is required");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

const data = await response.json();

if (!response.ok) {
  setError(data.message);
  return;
}

console.log(data);
  return (
    <main>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          Create Account
        </button>
      </form>
    </main>
  );
}