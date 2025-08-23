"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Confirmemail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const checkEmail = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // redirect to include email in query string
    if (response.ok && data.exists) {
        window.location.href = `/forgot-password?email=${encodeURIComponent(email)}`;
    } else {
        // Email not found → show popup
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Error checking email:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowPopup(false);
    setLoading(true);

    await checkEmail(email);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef]">
      <div className="bg-white rounded-3xl shadow-xl px-12 py-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full text-left">
          Confirm Email
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
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Checking..." : "Confirm"}
          </button>

          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>

        {/* Custom popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Email Not Found
              </h2>
              <p className="text-gray-600 mb-5">
                The email you entered is not registered. Please try again or
                sign up.
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center w-full">
          <span className="text-gray-500 text-base">Back to Sign In? </span>
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
