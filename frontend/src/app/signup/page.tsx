"use client";
import { useState, useEffect } from "react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.access_token); // save JWT
        setSuccess("Account created and logged in! Redirecting...");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Sign up failed.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef]">
      <div className="bg-white rounded-3xl shadow-xl px-12 py-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full text-left">
          Sign Up
        </h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          {error && (
            <div className="text-red-600 text-center mt-2">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-center mt-2">{success}</div>
          )}
        </form>
        <div className="mt-6 text-center w-full">
          <span className="text-gray-500 text-base">
            Already have an account?{" "}
          </span>
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline text-base"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
