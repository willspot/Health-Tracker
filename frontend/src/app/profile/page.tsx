"use client";
import Nav from "../nav";
import { useEffect, useState } from "react";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setEmail(data.email || "");
        setName(data.name || "");
        setOriginalEmail(data.email || "");
        setOriginalName(data.name || "");
      })
      .catch(() => {
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = () => {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    // email regex
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format.";
    return "";
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!editing) {
      setEditing(true);
      return;
    }
    // Validation
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    // Check for changes
    if (email === originalEmail && name === originalName) {
      setError("");
      setSuccess("No changes made");
      setEditing(false);
      return;
    }
    // Submit update
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/user/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setSuccess("Update successful");
          setOriginalEmail(email);
          setOriginalName(name);
          setEditing(false);
        } else {
          setError(data.message || "Update failed");
        }
      })
      .catch(() => setError("Update failed"))
      .finally(() => setLoading(false));
  };

  // Password validation
  const validatePassword = () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim())
      return "All fields are required.";
    if (newPassword.length < 6)
      return "New password must be at least 6 characters.";
    if (newPassword !== confirmPassword) return "New passwords do not match.";
    return "";
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    const validationError = validatePassword();
    if (validationError) {
      setPwError(validationError);
      return;
    }
    setPwLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/user/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setPwSuccess("Password updated successfully");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setPwError(data.message || "Password update failed");
        }
      })
      .catch(() => setPwError("Password update failed"))
      .finally(() => setPwLoading(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full bg-gradient-to-br from-[#eaf1fb] to-[#e3e6ef] flex flex-col items-center justify-center p-4 sm:p-10 mt-32">
        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl items-stretch">
          {/* Profile Box */}
          <div className="bg-white/70 rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">Profile</h1>
            {error && (
              <div className="text-red-600 text-center mt-2">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-center mt-2">{success}</div>
            )}
            <form className="w-full flex flex-col gap-5" onSubmit={handleEdit}>
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
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={!editing}
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Loading..." : editing ? "Submit" : "Edit Profile"}
              </button>
            </form>
          </div>
          {/* Password Change Box */}
          <div className="bg-white/70 rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">
              Change Password
            </h1>
            {pwError && (
              <div className="text-red-600 text-center mt-2">{pwError}</div>
            )}
            {pwSuccess && (
              <div className="text-green-600 text-center mt-2">{pwSuccess}</div>
            )}
            <form
              className="w-full flex flex-col gap-5"
              onSubmit={handlePasswordChange}
            >
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
                  placeholder="Enter your old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border text-gray-900 border-gray-200 focus:outline-none focus:border-blue-500 transition text-base"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
                disabled={pwLoading}
              >
                {pwLoading ? "Loading..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
