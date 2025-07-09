export async function fetchMetrics() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/metrics', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    window.location.href = '/login';
    return;
  }
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
} 