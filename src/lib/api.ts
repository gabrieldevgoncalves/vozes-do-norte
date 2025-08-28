const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.festivaldamusicagospelparaense.com";
export const getCities = () => fetch(`${API_BASE}/cities`).then(r => r.json());
export const createParticipant = (data: any) =>
  fetch(`${API_BASE}/participants`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
