export async function updateMetric(formData: FormData) {
  const token = localStorage.getItem('token');
  // console.log('Current token:', token); // <--- Add this line
  const response = await fetch("http://localhost:8000/api/update_metric", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response is not JSON, return a generic error
    return { status: "error", message: "Invalid server response" };
  }

  if (!response.ok) {
    // If HTTP status is not ok, treat as error
    return { status: "error", message: data?.message || "Failed to add metric" };
  }

  return data;
}