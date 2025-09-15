export async function apiRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${process.env.FHIR_BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/fhir+json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} - ${await res.text()}`);
  }
  return res.json();
}
