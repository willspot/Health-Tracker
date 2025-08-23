"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Passport login function
async function loginWithJWT(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await response.json();
  // console.log("Response data:", data);

  if (response.ok && data.access_token) {
    localStorage.setItem("token", data.access_token);
    return { status: "success", token: data.access_token };
  } else {
    return { status: "error", message: data.error || "Login failed" };
  }
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginWithJWT(email, password);
      if (result.status === "success") {
        window.location.href = "/";
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleUserRequest = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      await fetch(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Error handling user request:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef]">
      <div className="bg-white rounded-3xl shadow-xl px-12 py-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full text-left">
          Sign In
        </h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
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
          <div className="text-right w-full">
            <a
              href="/confirm-email"
              className="text-blue-600 font-semibold hover:underline text-base"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {error && (
            <div className="text-red-600 text-center mt-2">{error}</div>
          )}
        </form>
        <div className="mt-6 text-center w-full">
          <span className="text-gray-500 text-base">
            Don&apos;t have an account?{" "}
          </span>
          <a
            href="/signup"
            className="text-blue-600 font-semibold hover:underline text-base"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
