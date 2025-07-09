"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Optionally, call backend logout endpoint
    fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
