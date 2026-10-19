import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { eventUrl, savedEventIds, setEventSaved } from '../../utils/eventUtils.js'

export default function EventCard({ event, featured = false }) {
  const location = useLocation()
  const [saved, setSaved] = useState(() => savedEventIds().includes(event.id))
  useEffect(() => {
    const sync = () => setSaved(savedEventIds().includes(event.id))
    window.addEventListener('buzzbox:saved-events', sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('buzzbox:saved-events', sync); window.removeEventListener('storage', sync) }
  }, [event.id])
  const destination = { pathname: eventUrl(event.id) }
  const detailState = { from: `${location.pathname}${location.search}`, scrollY: window.scrollY }
  const rememberPosition = () => sessionStorage.setItem('buzzbox:explore-scroll', String(window.scrollY))
  return <article className="group flex flex-col overflow-hidden rounded border border-[#22222b] bg-[#1b1b1f] transition hover:bg-[#1f1f23]">
    <div className={`relative overflow-hidden bg-[#2a292e] ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}><Link to={destination} state={detailState} onClick={rememberPosition} aria-label={`Explore ${event.title}`} className="absolute inset-0"><img src={event.image} alt={event.category} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute inset-0 bg-gradient-to-t from-[#131317]/65 to-transparent"/></Link><span className="pointer-events-none absolute left-2 top-2 rounded bg-[#0e0e12]/90 px-2 py-1 text-[8px] font-extrabold uppercase tracking-widest text-[#d2f000]">{event.category}</span><button type="button" aria-label={saved ? 'Remove from saved events' : 'Save event'} aria-pressed={saved} onClick={() => setEventSaved(event.id, !saved)} className={`absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full bg-[#0e0e12]/85 text-lg ${saved ? 'text-[#d2f000]' : 'text-white hover:text-[#d2f000]'}`}>{saved ? '♥' : '♡'}</button></div>
    <div className="flex flex-1 flex-col justify-between gap-4 p-3.5"><div><p className="mb-1 text-[9px] font-extrabold uppercase text-[#d2f000]">{event.date || 'Tonight'} &nbsp;·&nbsp; {event.time}</p><h3 className="line-clamp-2 font-[Epilogue] text-sm font-bold uppercase leading-tight"><Link to={destination} state={detailState} onClick={rememberPosition} className="hover:text-[#d2f000]">{event.title}</Link></h3><p className="mt-1.5 text-[11px] text-[#c6c9ab]">⌖ &nbsp;{event.venue} · {event.city}</p></div>
      <div className="flex justify-end"><Link to={destination} state={detailState} onClick={rememberPosition} className="rounded bg-[#d2f000] px-3 py-2 text-[9px] font-extrabold uppercase tracking-wider text-[#2c3400] transition hover:brightness-110">{event.action || 'Explore Event'}</Link></div>
    </div>
  </article>
}
