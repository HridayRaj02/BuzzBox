// Reservation checkout: converts selected ticket tiers into one server-side booking.
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { calculateTotal } from '../utils/eventUtils.js'
import { api, mapEvent } from '../lib/api.js'
import { useAuth } from '../hooks/useAuthContext.js'

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function CheckoutPage() {
  const { eventId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const quantities = useMemo(() => state?.quantities || {}, [state])
  useEffect(() => {
    let cancelled = false
    api(`/api/events/${encodeURIComponent(eventId)}`).then((data) => { if (!cancelled) setEvent(mapEvent(data)) }).catch((requestError) => { if (!cancelled) setError(requestError.message) })
    return () => { cancelled = true }
  }, [eventId])
  const total = useMemo(() => event ? calculateTotal(event.ticketTiers, quantities) : 0, [event, quantities])

  async function reserve() {
    if (!user) { navigate('/login', { state: { from: `/checkout/${eventId}` } }); return }
    const items = event.ticketTiers.filter((tier) => quantities[tier.name] > 0).map((tier) => ({ tierId: tier.id, quantity: quantities[tier.name] }))
    setBusy(true); setError('')
    try {
      const result = await api(`/api/events/${event.eventId}/bookings`, { method: 'POST', body: JSON.stringify({ items }) })
      navigate('/profile/pass', { replace: true, state: { booking: result.booking } })
    } catch (requestError) { setError(requestError.message || 'Could not reserve tickets.') }
    finally { setBusy(false) }
  }

  if (authLoading || !event && !error) return <main className="grid min-h-screen place-items-center bg-[#131317] px-5 text-sm text-[#c6c9ab]">Loading checkout…</main>
  if (!event) return <main className="grid min-h-screen place-items-center bg-[#131317] px-5 text-center text-[#e4e1e7]"><div><h1 className="font-[Epilogue] text-2xl font-extrabold uppercase">Event not found</h1><p className="mt-3 text-sm text-[#c6c9ab]">{error}</p><Link to="/explore" className="mt-4 inline-block text-sm text-[#d2f000]">Back to Explore</Link></div></main>
  return <main className="grid min-h-screen place-items-center bg-[#131317] px-4 text-[#e4e1e7]"><section className="w-full max-w-lg rounded border border-[#22222b] bg-[#1b1b1f] p-6"><Link to={`/events/${event.id}`} className="text-[10px] font-extrabold uppercase tracking-widest text-[#d2f000]">← Event details</Link><p className="mt-6 text-[9px] font-extrabold uppercase tracking-widest text-[#d2f000]">BUZZBOX CHECKOUT</p><h1 className="mt-2 font-[Epilogue] text-2xl font-extrabold uppercase">{event.title}</h1><p className="mt-1 text-xs text-[#c6c9ab]">{event.date} · {event.time} · {event.venue}</p><div className="my-6 divide-y divide-white/10 border-y border-white/10">{event.ticketTiers.filter((tier) => quantities[tier.name] > 0).map((tier) => <div key={tier.id} className="flex justify-between py-3 text-sm"><span>{tier.name} × {quantities[tier.name]}</span><span>{money(tier.price * quantities[tier.name])}</span></div>)}</div><div className="flex justify-between font-bold"><span>Total due</span><span>{money(total)}</span></div><button type="button" disabled={!total || busy} onClick={reserve} className="mt-5 w-full rounded bg-[#d2f000] px-4 py-3 text-xs font-extrabold uppercase text-[#2c3400] disabled:opacity-40">{busy ? 'Reserving tickets…' : user ? 'Reserve tickets' : 'Sign in to reserve'}</button>{error && <p role="status" className="mt-3 rounded border border-[#71413b] bg-[#301f1f] p-3 text-xs text-[#ffb4a9]">{error}</p>}<p className="mt-3 text-center text-[10px] text-[#909378]">Your reservation is recorded securely. Online payment will be added only after a payment provider is configured.</p></section></main>
}
