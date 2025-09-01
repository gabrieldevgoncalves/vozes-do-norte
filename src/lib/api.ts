const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.festivaldamusicagospelparaense.com";
const VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1'

const baseInit: RequestInit = {
  cache: 'no-store',
  next: { revalidate: 0 },
  headers: { Accept: 'application/json' },
}

export async function getCities(signal?: AbortSignal) {
  const res = await fetch(`${API_BASE}/cities?v=${VERSION}`, {
    ...baseInit,
    signal,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createParticipant<TBody extends object>(
  data: TBody,
  signal?: AbortSignal
) {
  return fetch(`${API_BASE}/participants`, {
    ...baseInit,
    method: 'POST',
    signal,
    headers: {
      ...baseInit.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}