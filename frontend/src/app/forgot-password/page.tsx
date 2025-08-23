"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPassword() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password updated successfully. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef]">
      <div className="bg-white rounded-3xl shadow-xl px-12 py-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full text-left">
          Enter New Password
        </h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>

          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
          {success && (
            <div className="text-green-600 text-center mt-2">{success}</div>
          )}
        </form>
        <div className="mt-6 text-center w-full">
          <span className="text-gray-500 text-base">Return to Sign In? </span>
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline text-base"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
