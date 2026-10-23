import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { events } from '../data/mockEvents.js'
import EventCard from '../components/home/EventCard.jsx'
import DiscoveryHeader from '../components/home/DiscoveryHeader.jsx'
import { calculateTotal, isEventEnded, savedEventIds, setEventSaved } from '../utils/eventUtils.js'

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
const dateLabel = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export default function EventDetailsPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const event = events.find((item) => item.id === eventId)
  const [quantities, setQuantities] = useState({})
  const [saved, setSaved] = useState(() => savedEventIds().includes(eventId))
  const [message, setMessage] = useState('')
  const total = useMemo(() => event ? calculateTotal(event.ticketTiers, quantities) : 0, [event, quantities])
  const ended = event ? isEventEnded(event) : false

  useEffect(() => { window.scrollTo(0, 0) }, [eventId])
  useEffect(() => {
    if (!event) return
    document.title = `${event.title} | BUZZBOX`
    let description = document.querySelector('meta[name="description"]')
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.appendChild(description) }
    description.content = `${event.description} ${event.venue}, ${event.city}.`
    return () => { document.title = 'BuzzBox — Explore the Scene' }
  }, [event])
  useEffect(() => {
    const sync = () => setSaved(savedEventIds().includes(eventId))
    window.addEventListener('buzzbox:saved-events', sync)
    return () => window.removeEventListener('buzzbox:saved-events', sync)
  }, [eventId])

  if (!event) return <main className="grid min-h-screen place-items-center bg-[#131317] px-5 text-[#e4e1e7]"><div className="text-center"><p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#d2f000]">BUZZBOX</p><h1 className="font-[Epilogue] text-3xl font-extrabold uppercase">Event not found</h1><p className="my-4 text-sm text-[#c6c9ab]">This event may have been removed or the link may be incorrect.</p><Link to="/explore" className="inline-flex rounded bg-[#d2f000] px-4 py-3 text-xs font-extrabold uppercase text-[#2c3400]">Back to Explore</Link></div></main>

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: event.title, text: event.description, url })
      else { await navigator.clipboard.writeText(url); setMessage('Event link copied to clipboard.') }
    } catch (error) { if (error.name !== 'AbortError') setMessage('Unable to share this event.') }
  }
  const downloadCalendar = () => {
    const startDate = event.date.replaceAll('-', '')
    const [time, meridiem] = event.time.split(' ')
    let [hour, minute] = time.split(':').map(Number)
    if (meridiem === 'PM' && hour !== 12) hour += 12
    if (meridiem === 'AM' && hour === 12) hour = 0
    const start = `${startDate}T${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}00`
    const endHour = String((hour + 3) % 24).padStart(2, '0')
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BUZZBOX//Events//EN', 'BEGIN:VEVENT', `UID:${event.id}@buzzbox`, `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART:${start}`, `DTEND:${startDate}T${endHour}${String(minute).padStart(2, '0')}00`, `SUMMARY:${event.title}`, `LOCATION:${event.address}`, `DESCRIPTION:${event.description}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(blob); anchor.download = `${event.id}.ics`; anchor.click(); URL.revokeObjectURL(anchor.href)
  }
  const directions = `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
  const related = useMemo(() => {
    const candidates = events.filter((item) => item.category === event?.category && item.id !== event?.id)
    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1))
      ;[candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]]
    }
    return candidates.slice(0, 4)
  }, [eventId])

  return <div className="min-h-screen bg-[#131317] bg-[radial-gradient(rgba(144,147,120,.14)_1px,transparent_1px)] bg-[size:24px_24px] text-[#e4e1e7] selection:bg-[#d2f000] selection:text-[#2c3400]">
    <DiscoveryHeader city={localStorage.getItem('buzzbox:city') || event.city} onCityChange={(city) => localStorage.setItem('buzzbox:city', city)} />
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-7 sm:pt-24">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><span className="rounded bg-[#20211a] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.16em] text-[#d2f000]">{event.category}</span><div className="flex gap-2"><button type="button" onClick={() => setEventSaved(event.id, !saved)} aria-pressed={saved} className="rounded border border-[#303036] px-3 py-2 text-xs hover:border-[#d2f000]">{saved ? '♥ Saved' : '♡ Save'}</button><button type="button" onClick={share} className="rounded border border-[#303036] px-3 py-2 text-xs hover:border-[#d2f000]">↗ Share</button></div></div>
      <div className="grid gap-7 lg:grid-cols-[1.35fr_.8fr]">
        <section><div className="relative overflow-hidden rounded border border-[#22222b] bg-[#1b1b1f]"><img src={event.image} alt={event.title} className="aspect-[16/9] w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12]/90 via-transparent to-transparent"/><div className="absolute inset-x-0 bottom-0 p-5 sm:p-8"><p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#d2f000]">{event.category} · {event.city}</p><h1 className="max-w-3xl font-[Epilogue] text-3xl font-extrabold uppercase leading-tight sm:text-5xl">{event.title}</h1></div></div>
          {ended && <p className="mt-4 rounded border border-[#71413b] bg-[#301f1f] p-3 text-xs font-bold uppercase tracking-wide text-[#ffb4a9]">This event has ended</p>}
          <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['DATE', dateLabel(event.date)], ['TIME', event.time], ['VENUE', event.venue], ['AGE LIMIT', `${event.ageLimit}+`]].map(([label, value]) => <div key={label} className="rounded border border-[#22222b] bg-[#1b1b1f] p-4"><p className="mb-2 text-[9px] font-extrabold uppercase tracking-widest text-[#909378]">{label}</p><p className="text-xs font-bold leading-5">{value}</p></div>)}</section>
          <section className="mt-8"><h2 className="mb-3 font-[Epilogue] text-lg font-extrabold uppercase">About this event</h2><p className="text-sm leading-7 text-[#c6c9ab]">{event.description}</p></section>
          <section className="mt-8"><h2 className="mb-3 font-[Epilogue] text-lg font-extrabold uppercase">Lineup</h2><div className="flex flex-wrap gap-2">{event.lineup.map((artist) => <span key={artist} className="rounded border border-[#303036] bg-[#1b1b1f] px-3 py-2 text-xs">{artist}</span>)}</div></section>
          <section className="mt-8 rounded border border-[#22222b] bg-[#1b1b1f] p-5"><h2 className="font-[Epilogue] text-lg font-extrabold uppercase">Venue & directions</h2><p className="mt-2 text-sm text-[#c6c9ab]">{event.venue}<br/>{event.address}</p><a href={directions} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded bg-[#2a292e] px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-[#d2f000]">Get Directions ↗</a></section>
          <section className="mt-8"><h2 className="mb-3 font-[Epilogue] text-lg font-extrabold uppercase">Good to know</h2><ul className="grid gap-2 sm:grid-cols-2">{event.goodToKnow.map((rule) => <li key={rule} className="rounded border border-[#22222b] bg-[#1b1b1f] p-3 text-xs text-[#c6c9ab]">✓ &nbsp;{rule}</li>)}</ul></section>
        </section>
        <aside className="h-fit rounded border border-[#22222b] bg-[#1b1b1f] p-5 lg:sticky lg:top-20"><p className="mb-1 text-[9px] font-extrabold uppercase tracking-widest text-[#d2f000]">Tickets</p><h2 className="mb-5 font-[Epilogue] text-xl font-extrabold uppercase">Choose your entry</h2><div className="divide-y divide-white/10">{event.ticketTiers.map((tier) => <div key={tier.name} className="flex items-center justify-between gap-3 py-4"><div><p className="text-sm font-bold">{tier.name}</p><p className="mt-1 text-xs text-[#c6c9ab]">{money(tier.price)} · {tier.availableQuantity} available</p></div><div className="flex items-center gap-3"><button type="button" aria-label={`Decrease ${tier.name}`} disabled={ended || !quantities[tier.name]} onClick={() => setQuantities((current) => ({ ...current, [tier.name]: Math.max(0, (current[tier.name] || 0) - 1) }))} className="grid size-8 place-items-center rounded border border-[#393940] disabled:opacity-40">−</button><span className="w-4 text-center text-sm">{quantities[tier.name] || 0}</span><button type="button" aria-label={`Increase ${tier.name}`} disabled={ended || (quantities[tier.name] || 0) >= tier.availableQuantity} onClick={() => setQuantities((current) => ({ ...current, [tier.name]: Math.min(tier.availableQuantity, (current[tier.name] || 0) + 1) }))} className="grid size-8 place-items-center rounded border border-[#393940] disabled:opacity-40">+</button></div></div>)}</div><div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-sm font-bold"><span>Total</span><span>{money(total)}</span></div><button type="button" disabled={ended || total === 0} onClick={() => navigate(`/checkout/${event.id}`, { state: { quantities, total } })} className="mt-4 w-full rounded bg-[#d2f000] px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-[#2c3400] disabled:cursor-not-allowed disabled:opacity-40">{ended ? 'Event ended' : 'Book Now'}</button><button type="button" onClick={downloadCalendar} className="mt-3 w-full rounded border border-[#393940] px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider hover:border-[#d2f000]">＋ Add to Calendar</button></aside>
      </div>
      <section className="mt-14"><p className="mb-2 text-[9px] font-extrabold uppercase tracking-widest text-[#d2f000]">Keep exploring</p><h2 className="mb-5 font-[Epilogue] text-2xl font-extrabold uppercase">More like this</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <EventCard key={item.id} event={item}/>)}</div></section>
    </main>
    {message && <div role="status" className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded border border-[#454932] bg-[#1b1b1f] px-4 py-3 text-xs shadow-xl">{message}<button type="button" aria-label="Dismiss" onClick={() => setMessage('')} className="ml-3 text-[#d2f000]">×</button></div>}
  </div>
}
