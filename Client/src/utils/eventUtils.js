// Pure event helpers kept independent from React so they are easy to test.
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

// URL creation stays separate so cards and tests use the same route format.
export function eventUrl(id) { return `/events/${encodeURIComponent(id)}` }
