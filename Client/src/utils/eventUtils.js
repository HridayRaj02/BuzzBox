export function calculateTotal(tiers, quantities) {
  return tiers.reduce((total, tier) => total + tier.price * (quantities[tier.name] || 0), 0)
}

export function isEventEnded(event, now = new Date()) {
  const [year, month, day] = event.date.split('-').map(Number)
  const [time, meridiem] = event.time.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  return new Date(year, month - 1, day, hours, minutes) < now
}

export function savedEventIds() {
  try { return JSON.parse(localStorage.getItem('buzzbox:saved-events') || '[]') } catch { return [] }
}

export function setEventSaved(id, saved) {
  const next = new Set(savedEventIds())
  saved ? next.add(id) : next.delete(id)
  localStorage.setItem('buzzbox:saved-events', JSON.stringify([...next]))
  window.dispatchEvent(new Event('buzzbox:saved-events'))
}

export function eventUrl(id) { return `/events/${encodeURIComponent(id)}` }
