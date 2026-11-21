// Single HTTP client and API-to-UI event mapper used throughout the frontend.
const API_BASE = import.meta.env.VITE_API_URL || ''

export class ApiError extends Error {
  constructor(message, status) { super(message); this.name = 'ApiError'; this.status = status }
}

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    ...options,
  })
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(body?.error || 'The request could not be completed.', response.status)
  return body
}

const indianDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' })
const indianTime = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })

export function mapEvent(event) {
  const startsAt = new Date(event.startsAt)
  const categoryLabels = { ART_CULTURE: 'ART & CULTURE', LIVE_SHOWS: 'LIVE SHOWS', AFTER_HOURS: 'AFTER HOURS' }
  const category = categoryLabels[event.category] || event.category.replaceAll('_', ' ')
  return {
    ...event,
    id: event.slug,
    eventId: event.id,
    category,
    categories: [category],
    city: event.city?.name || '',
    venue: event.venue?.name || '',
    address: event.venue?.address || '',
    image: event.coverImage,
    date: dateKey(startsAt),
    time: indianTime.format(startsAt),
    ticketTiers: (event.ticketTiers || []).map((tier) => ({ ...tier, availableQuantity: tier.availableQuantity ?? Math.max(0, tier.quantity - tier.sold) })),
    goodToKnow: (event.rules || []).map((rule) => rule.title),
    lineup: (event.artists || []).map(({ artist }) => artist.name),
  }
}

// Intl output differs by browser locale; this gives the UI a stable YYYY-MM-DD value.
function dateKey(date) {
  const values = Object.fromEntries(indianDate.formatToParts(date).map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}
