"use client";
import { useState, useEffect } from "react";

// Passport login function
async function loginWithPassport(email: string, password: string) {
  const client_id = '0197d04d-ac53-71c3-911b-17739dbcc6ac'; // <-- oauth_clients id
  const client_secret = 'A7vVsGxyI9N1tVaEMnTBocewJakgT6u8N2GKdS1s'; // <-- oauth_clients secret

  const response = await fetch('http://localhost:8000/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'password',
      client_id,
      client_secret,
      username: email,
      password,
      scope: ''
    })
  });
  const data = await response.json();
  if (response.ok && data.access_token) {
    localStorage.setItem('token', data.access_token);
    return { status: 'success', token: data.access_token };
  } else {
    return { status: 'error', message: data.error_description || 'Login failed' };
  }
}

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to login after 3 seconds when registration is successful
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Send signup request as JSON
      const res = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.status === "success") {
        // Log in with Passport to get token
        const loginResult = await loginWithPassport(email, password);
        if (loginResult.status === 'success') {
          setSuccess("Account created and logged in! Redirecting to dashboard...");
          setName(""); setEmail(""); setPassword("");
          window.location.href = "/";
        } else {
          setSuccess("Account created, but login failed. Please log in manually.");
        }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full text-left">Sign Up</h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
          {success && <div className="text-green-600 text-center mt-2">{success}</div>}
        </form>
        <div className="mt-6 text-center w-full">
          <span className="text-gray-500 text-base">Already have an account? </span>
          <a href="/login" className="text-blue-600 font-semibold hover:underline text-base">Login</a>
        </div>
      </div>
    </div>
  );
}