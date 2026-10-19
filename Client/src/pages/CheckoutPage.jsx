import { Link, useLocation, useParams } from 'react-router-dom'
import { events } from '../data/mockEvents.js'
import { calculateTotal } from '../utils/eventUtils.js'

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function CheckoutPage() {
  const { eventId } = useParams()
  const { state } = useLocation()
  const event = events.find((item) => item.id === eventId)
  if (!event) return <main className="grid min-h-screen place-items-center bg-[#131317] px-5 text-center text-[#e4e1e7]"><div><h1 className="font-[Epilogue] text-2xl font-extrabold uppercase">Event not found</h1><Link to="/explore" className="mt-4 inline-block text-sm text-[#d2f000]">Back to Explore</Link></div></main>
  const quantities = state?.quantities || {}
  const total = calculateTotal(event.ticketTiers, quantities)
  return <main className="grid min-h-screen place-items-center bg-[#131317] px-4 text-[#e4e1e7]"><section className="w-full max-w-lg rounded border border-[#22222b] bg-[#1b1b1f] p-6"><Link to={`/events/${event.id}`} className="text-[10px] font-extrabold uppercase tracking-widest text-[#d2f000]">← Event details</Link><p className="mt-6 text-[9px] font-extrabold uppercase tracking-widest text-[#d2f000]">BUZZBOX CHECKOUT</p><h1 className="mt-2 font-[Epilogue] text-2xl font-extrabold uppercase">{event.title}</h1><p className="mt-1 text-xs text-[#c6c9ab]">{event.date} · {event.time} · {event.venue}</p><div className="my-6 divide-y divide-white/10 border-y border-white/10">{event.ticketTiers.filter((tier) => quantities[tier.name] > 0).map((tier) => <div key={tier.name} className="flex justify-between py-3 text-sm"><span>{tier.name} × {quantities[tier.name]}</span><span>{money(tier.price * quantities[tier.name])}</span></div>)}</div><div className="flex justify-between font-bold"><span>Total due</span><span>{money(total)}</span></div><button type="button" disabled={!total} className="mt-5 w-full rounded bg-[#d2f000] px-4 py-3 text-xs font-extrabold uppercase text-[#2c3400] disabled:opacity-40">{total ? 'Continue to payment' : 'No tickets selected'}</button><p className="mt-3 text-center text-[10px] text-[#909378]">Checkout preview · Payment processing is not connected.</p></section></main>
}
