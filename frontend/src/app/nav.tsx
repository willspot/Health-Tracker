"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[80vw] max-w-5xl z-50">
      <div className="flex items-center justify-between bg-white/70 backdrop-blur rounded-3xl shadow-xl px-8 py-4">
        {/* Left: Brand */}
        <span className="text-2xl font-bold text-blue-700">Health Tracker</span>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-gray-700 mb-1 rounded" />
          <span className="block w-6 h-0.5 bg-gray-700 mb-1 rounded" />
          <span className="block w-6 h-0.5 bg-gray-700 rounded" />
        </button>
        {/* Right: Icons */}
        <div className="hidden sm:flex items-center gap-8 text-2xl text-gray-700">
          {/* Home */}
          <button
            className="hover:text-blue-700 transition-colors"
            aria-label="Home"
            onClick={() => router.push("/")}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg>
          </button>
          {/* Profile */}
          <button
            className="hover:text-blue-700 transition-colors"
            aria-label="Profile"
            onClick={() => router.push("/profile")}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1"/></svg>
          </button>
          {/* Logout */}
          <button 
            className="hover:text-blue-700 transition-colors" 
            aria-label="Logout"
            onClick={() => router.push("/logout")}
            >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 21V3a2 2 0 012-2h7"/></svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden mt-2 bg-white/90 rounded-2xl shadow-lg flex flex-col items-end px-6 py-4 gap-4">
          <button
            className="text-xl text-gray-700 hover:text-blue-700 flex items-center gap-2"
            aria-label="Home"
            onClick={() => {
              setOpen(false);
              router.push("/");
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg>
            Home
          </button>
          <button
            className="text-xl text-gray-700 hover:text-blue-700 flex items-center gap-2"
            aria-label="Profile"
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1"/></svg>
            Profile
          </button>
          <button className="text-xl text-gray-700 hover:text-blue-700 flex items-center gap-2" aria-label="Logout">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 21V3a2 2 0 012-2h7"/></svg>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
