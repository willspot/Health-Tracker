"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Optionally, call backend logout endpoint
    fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).catch(() => {});

    // Redirect to login
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-lg text-gray-600">Logging out...</span>
    </div>
  );
}
