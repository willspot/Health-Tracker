export async function fetchMetrics() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    window.location.href = "/login";
    return;
  }
  if (!response.ok) throw new Error("Failed to fetch metrics");
  return response.json();
}
