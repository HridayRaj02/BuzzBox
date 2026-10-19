import { useEffect, useMemo, useState } from 'react'
import DiscoveryHeader from '../components/home/DiscoveryHeader.jsx'
import { categories, events, eventMatchesDate, vibeTiles } from '../data/mockEvents.js'
import { allCitiesOption, cityOptions } from '../data/cities.js'
import CityDropdown from '../components/home/CityDropdown.jsx'

const dates = ['Tonight', 'This Weekend', 'Next Week', 'All Dates']
const nearby = [
  ['2.4 KM · OKHLA INDUSTRIAL AREA', 'Subterranean Bass Lab', 'Heavy sub-bass, broken beats, and modular live audio inside an active fabrication warehouse.', '11:00 PM'],
  ['5.1 KM · CHATTARPUR', 'Midnight Greenhouse Disco', 'Groove-led disco and funk wrapped around a night of secret botanical sensory immersion.', '10:30 PM'],
  ['8.2 KM · DHAN MILL', 'Analog Audiophile Salon', 'Full-urban listening on Japanese tube amplifiers. No small talk during playback.', '09:00 PM'],
]

function SectionHeading({ eyebrow, title, description, id }) {
  return <div id={id} className="mb-5 flex items-end justify-between gap-4">
    <div><p className="mb-1 text-[9px] font-extrabold uppercase tracking-[.16em] text-[#dfff00]">{eyebrow}</p><h2 className="font-[Epilogue] text-xl font-extrabold uppercase tracking-tight sm:text-2xl">{title}</h2>{description && <p className="mt-1 text-xs text-[#c6c9ab] sm:text-sm">{description}</p>}</div>
  </div>
}

function SearchPanel({ onSearch, city, onCityChange }) {
  const [date, setDate] = useState('Tonight')
  const [query, setQuery] = useState('')
  return <form onSubmit={(event) => { event.preventDefault(); onSearch({ date, query }) }} className="grid gap-1 rounded-lg bg-[#1b1b1f] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,.6)] md:grid-cols-[1fr_1fr_1.2fr_auto] md:items-stretch">
    <label className="rounded px-3 py-2 transition hover:bg-[#1f1f23]"><span className="mb-1 block text-[9px] font-extrabold uppercase tracking-wider text-[#c6c9ab]">⌖ &nbsp;Where</span><CityDropdown value={city} onChange={onCityChange} /></label>
    <label className="rounded border-t border-white/5 px-3 py-2 transition hover:bg-[#1f1f23] md:border-l md:border-t-0"><span className="mb-1 block text-[9px] font-extrabold uppercase tracking-wider text-[#c6c9ab]">▦ &nbsp;When</span><select className="w-full bg-transparent font-[Epilogue] text-sm font-bold text-[#e4e1e7] outline-none" value={date} onChange={(event) => setDate(event.target.value)}>{dates.map((item) => <option className="bg-[#1b1b1f]" key={item}>{item}</option>)}</select></label>
    <label className="rounded border-t border-white/5 px-3 py-2 transition hover:bg-[#1f1f23] md:border-l md:border-t-0"><span className="mb-1 block text-[9px] font-extrabold uppercase tracking-wider text-[#c6c9ab]">≋ &nbsp;What</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent font-[Epilogue] text-sm text-[#e4e1e7] outline-none placeholder:text-[#909378]" placeholder="Events, music, comedy..." /></label>
    <button className="flex min-h-11 items-center justify-center gap-2 rounded bg-[#d2f000] px-5 font-[Epilogue] text-xs font-extrabold uppercase tracking-wide text-[#2c3400] transition hover:brightness-110 active:translate-y-px" type="submit">⌕ &nbsp; Search</button>
  </form>
}

function EventCard({ event, featured = false, onAction }) {
  const [saved, setSaved] = useState(false)
  return <article className="group flex flex-col overflow-hidden rounded border border-[#22222b] bg-[#1b1b1f] transition hover:bg-[#1f1f23]">
    <div className={`relative overflow-hidden bg-[#2a292e] ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
      <img src={event.image} alt={event.category} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#131317]/65 to-transparent" />
      <span className="absolute left-2 top-2 rounded bg-[#0e0e12]/90 px-2 py-1 text-[8px] font-extrabold uppercase tracking-widest text-[#d2f000]">{event.category}</span>
      <button type="button" aria-label={saved ? 'Remove from saved events' : 'Save event'} aria-pressed={saved} onClick={() => setSaved((value) => !value)} className={`absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-[#0e0e12]/85 text-lg ${saved ? 'text-[#d2f000]' : 'text-white hover:text-[#d2f000]'}`}>{saved ? '♥' : '♡'}</button>
    </div>
    <div className="flex flex-1 flex-col justify-between gap-4 p-3.5">
      <div><p className="mb-1 text-[9px] font-extrabold uppercase text-[#d2f000]">{event.date || 'Tonight'} &nbsp;·&nbsp; {event.time}</p><h3 className="line-clamp-2 font-[Epilogue] text-sm font-bold uppercase leading-tight">{event.title}</h3><p className="mt-1.5 text-[11px] text-[#c6c9ab]">⌖ &nbsp;{event.venue} · {event.city}</p></div>
      <div className="flex justify-end"><button onClick={() => onAction(event)} type="button" className="rounded bg-[#d2f000] px-3 py-2 text-[9px] font-extrabold uppercase tracking-wider text-[#2c3400] transition hover:brightness-110">{event.action || 'Reserve'}</button></div>
    </div>
  </article>
}

export default function HomePage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [appliedSearch, setAppliedSearch] = useState(null)
  const [selectedCity, setSelectedCity] = useState('Delhi NCR')
  const [notice, setNotice] = useState('')
  const filteredEvents = useMemo(() => events.filter((event) => {
    const categoryMatch = activeCategory === 'ALL' || (activeCategory === 'TONIGHT' ? eventMatchesDate(event, 'Tonight') : event.categories.includes(activeCategory))
    const cityMatch = selectedCity === allCitiesOption || event.city === selectedCity
    const dateMatch = !appliedSearch || appliedSearch.date === 'All Dates' || eventMatchesDate(event, appliedSearch.date)
    const searchableText = `${event.title} ${event.category} ${event.categories.join(' ')} ${event.venue} ${event.city} ${event.description}`.toLowerCase()
    const queryMatch = !appliedSearch?.query.trim() || searchableText.includes(appliedSearch.query.trim().toLowerCase())
    return categoryMatch && cityMatch && dateMatch && queryMatch
  }), [activeCategory, appliedSearch, selectedCity])
  const radarResults = appliedSearch ? filteredEvents : filteredEvents.filter((event) => !eventMatchesDate(event, 'This Weekend'))
  const weekendResults = filteredEvents.filter((event) => eventMatchesDate(event, 'This Weekend'))
  const showPreviewNotice = (event) => { setNotice(`${event.title}: event details and booking will be available when BuzzBox ticketing is connected.`); window.setTimeout(() => setNotice(''), 4200) }

  return <div id="top" className="min-h-screen bg-[#131317] bg-[radial-gradient(rgba(144,147,120,.14)_1px,transparent_1px)] bg-[size:24px_24px] text-[#e4e1e7] selection:bg-[#d2f000] selection:text-[#2c3400]">
    <DiscoveryHeader city={selectedCity} onCityChange={setSelectedCity} />
    <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-[88px] sm:px-7 lg:px-12 lg:pt-24">
      <section className="pb-7 pt-3 sm:pb-9">
        <div className="mb-5 max-w-3xl"><p className="mb-2 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-widest text-[#d2f000]"><span className="size-2 animate-pulse rounded-full bg-[#d2f000]"/>{selectedCity} Radar Active</p><h1 className="font-[Epilogue] text-3xl font-extrabold uppercase leading-[1.05] tracking-[-.045em] sm:text-5xl">Find your next scene.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#c6c9ab] sm:text-base">Discover concerts, warehouse nights, secret listening rooms, comedy, festivals and experiences happening around you.</p></div>
        <SearchPanel city={selectedCity} onCityChange={setSelectedCity} onSearch={setAppliedSearch} />
        {appliedSearch && <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-[#c6c9ab]" role="status"><span>Showing {appliedSearch.date.toLowerCase()} events in {selectedCity}{appliedSearch.query.trim() ? ` matching “${appliedSearch.query.trim()}”` : ''}.</span><button type="button" onClick={() => { setAppliedSearch(null); setActiveCategory('ALL') }} className="font-extrabold uppercase tracking-wider text-[#d2f000]">Clear search ×</button></div>}
      </section>

      <section aria-label="Event categories" className="mb-8 flex gap-2 overflow-x-auto pb-2">{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`shrink-0 rounded-full px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-wider transition ${activeCategory === category ? 'bg-[#d2f000] text-[#2c3400]' : 'border border-[#22222b] bg-[#1f1f23] text-[#c6c9ab] hover:bg-[#2a292e] hover:text-white'}`}>{category}</button>)}</section>

      <section className="mb-10">
        <SectionHeading id="radar" eyebrow={appliedSearch ? '◉ Filtered radar' : '◉ Live radar'} title={appliedSearch ? 'Search results' : 'Live on the radar'} description={appliedSearch ? 'Events matching your selected city, date, category, and keywords.' : "What's happening around the city right now."} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{radarResults.map((event) => <EventCard key={event.id} event={event} featured onAction={showPreviewNotice} />)}</div>
        {!filteredEvents.length && <p className="rounded border border-[#22222b] bg-[#1b1b1f] p-6 text-sm text-[#c6c9ab]">No events match these filters. Try another city, date, category, or keyword.</p>}
      </section>

      {!appliedSearch && <>
      <section className="mb-10" id="experiences"><SectionHeading eyebrow="Curated aesthetics" title="What's your vibe?"/><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{vibeTiles.map(([title, subtitle, image]) => <button type="button" key={title} onClick={() => { setActiveCategory(title.includes('Funny') ? 'COMEDY' : title.includes('Art') ? 'ART & CULTURE' : title.includes('Loud') ? 'RAVE' : title.includes('Dance') ? 'CLUBS' : 'MUSIC'); document.getElementById('radar')?.scrollIntoView({ behavior: 'smooth' }) }} className="group relative flex h-44 items-end overflow-hidden rounded bg-[#1f1f23] p-3 text-left sm:h-56"><img src={image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-110"/><span className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-[#0e0e12]/40 to-transparent"/><span className="relative"><b className="block font-[Epilogue] text-xs font-extrabold uppercase leading-tight group-hover:text-[#d2f000] sm:text-sm">{title}</b><small className="mt-1 block text-[8px] uppercase tracking-wider text-[#c6c9ab]">{subtitle}</small></span></button>)}</div></section>

      <section className="mb-10"><div className="flex items-end justify-between"><SectionHeading eyebrow="Plans worth making" title="This weekend" description="The city's most interesting plans, in one place."/><div className="mb-5 hidden gap-1 sm:flex"><button type="button" aria-label="Previous events" onClick={() => setNotice('You are viewing the first set of weekend picks.')} className="size-9 rounded bg-[#1b1b1f] hover:bg-[#2a292e]">‹</button><button type="button" aria-label="Next events" onClick={() => setNotice('More weekend picks will be added to this preview.')} className="size-9 rounded bg-[#1b1b1f] hover:bg-[#2a292e]">›</button></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{weekendResults.map((event) => <EventCard key={event.id} event={event} onAction={showPreviewNotice}/>)}</div>{!weekendResults.length && <p className="text-sm text-[#c6c9ab]">No weekend plans match the selected city and category yet.</p>}</section>

      <section className="mb-10" id="nearby"><SectionHeading eyebrow="◉ Proximity radar" title="Near Delhi NCR" description="Events and experiences closer to your current perimeter."/><div className="grid gap-2 md:grid-cols-3">{nearby.map(([distance, title, description, time]) => <article key={title} className="border-y border-[#22222b] bg-[#1b1b1f]/80 px-3 py-4 sm:border sm:p-4"><div className="mb-4 flex justify-between gap-2 text-[8px] font-extrabold uppercase tracking-wider"><span className="text-[#d2f000]">{distance}</span><span>{time}</span></div><h3 className="font-[Epilogue] text-sm font-extrabold uppercase">{title}</h3><p className="my-2 text-xs leading-5 text-[#c6c9ab]">{description}</p><button onClick={() => showPreviewNotice({ title })} type="button" className="text-[9px] font-extrabold uppercase text-[#d2f000]">Explore event →</button></article>)}</div></section>

      <section className="mb-10 rounded border border-[#22222b] bg-[#0e0e12] p-5 sm:p-7">
        <div className="mb-5 flex items-end justify-between"><div><p className="mb-1 text-[9px] font-extrabold uppercase tracking-widest text-[#d2f000]">BuzzBox Originals</p><h2 className="font-[Epilogue] text-2xl font-extrabold uppercase">Curated experiences</h2><p className="mt-1 text-xs text-[#c6c9ab]">Proprietary series designed specifically for tastemakers, audiophiles, and night explorers.</p></div><span className="hidden text-[8px] font-extrabold uppercase tracking-widest sm:block">Restricted capacity</span></div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{[['◉', 'Secret Listening Sessions', 'Unannounced track premieres, custom audiophile-led sessions, zero phones permitted.', 'Invite / Ticket'], ['⌂', 'Warehouse Series', 'Raw concrete, high-output sound systems, and 18-hour marathon sets in undisclosed industrial locations.', 'Wristband only'], ['♩', 'Underground Comedy Cellar', 'No crowd work, no clips. Pure, unfiltered stand-up running until last light.', 'Limited seats'], ['✳', 'Audio-Visual Labs', 'Collaborative performances pairing real-time generative computation with modular sound architecture.', 'Experimental']].map(([icon, title, desc, tag], index) => <article key={title} className="bg-[#1b1b1f] p-4"><span className="text-lg text-[#d2f000]">{icon}</span><p className="mt-3 text-[8px] font-extrabold uppercase text-[#909378]">Series 0{index + 1}</p><h3 className="my-1 font-[Epilogue] text-xs font-extrabold uppercase">{title}</h3><p className="min-h-14 text-[10px] leading-4 text-[#c6c9ab]">{desc}</p><span className="mt-3 block text-[8px] font-extrabold uppercase tracking-wider text-[#d2f000]">{tag}</span></article>)}</div>
      </section>

      <section className="mb-10"><SectionHeading eyebrow="Cultural circuits" title="Explore the city" description="Tap into underground scenes across prime nightlife epicenters."/><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{[['Delhi NCR','Warehouse nights, industrial raves, listening bars.'],['Mumbai','Rooftop grooves, coastal clubbing, indie gigs.'],['Bengaluru','Underground bass, electronic collectives, techno clubs.'],['Goa','Beachside raves, twilight listening sessions.'],['Pune','Student collectives, intimate basement comedy.'],['Hyderabad','Deep house enclaves, heritage courtyards.']].map(([city, desc]) => <button type="button" key={city} onClick={() => { setSelectedCity(cityOptions.includes(city) ? city : allCitiesOption); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="min-h-24 bg-[#1b1b1f] p-3 text-left transition hover:bg-[#2a292e]"><b className="font-[Epilogue] text-xs font-extrabold uppercase">{city}</b><span className="mt-2 block text-[9px] leading-4 text-[#c6c9ab]">{desc}</span><span className="mt-2 block text-right text-[#d2f000]">→</span></button>)}</div></section>

      <section id="organizers" className="mb-10 rounded border border-[#22222b] bg-[#1f1f23] p-5 sm:p-8"><p className="mb-2 text-[9px] font-extrabold uppercase tracking-widest text-[#d2f000]">For creators & promoters</p><h2 className="font-[Epilogue] text-2xl font-extrabold uppercase sm:text-3xl">Got a scene to build?</h2><p className="mt-3 max-w-2xl text-sm text-[#c6c9ab]">Bring your event to the BuzzBox radar. Connect directly with cultural explorers and music lovers without algorithm friction.</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => setNotice('Organizer event submission is a preview and is not connected yet.')} className="rounded bg-[#d2f000] px-4 py-2.5 text-[9px] font-extrabold uppercase text-[#2c3400]">List an Event</button><button type="button" onClick={() => setNotice('Organizer console is not connected in this preview.')} className="rounded bg-[#2a292e] px-4 py-2.5 text-[9px] font-extrabold uppercase">Open Organizer Console ↗</button></div></section>
      </>}
    </main>

    <footer id="footer" className="border-t border-white/5 bg-[#0e0e12]"><div className="mx-auto grid max-w-[1440px] gap-7 px-4 py-8 sm:grid-cols-2 sm:px-7 lg:grid-cols-4 lg:px-12"><div><h2 className="font-[Epilogue] text-sm font-extrabold uppercase">BuzzBox</h2><p className="mt-2 max-w-xs text-[10px] leading-4 text-[#c6c9ab]">The premier underground nightlife, warehouse raves, and curated listening room ticketing registry.</p><p className="mt-3 text-[8px] font-extrabold uppercase tracking-wider text-[#d2f000]">● System Operational · Live</p></div><div><h3 className="mb-2 text-[8px] font-extrabold uppercase tracking-widest">BuzzBox</h3><div className="grid gap-1 text-[10px] text-[#c6c9ab]"><a href="#radar">Discovery Feed</a><a href="#radar">Upcoming Events</a><a href="#experiences">Curated Listening</a><a href="#nearby">Subculture Radar</a></div></div><div><h3 className="mb-2 text-[8px] font-extrabold uppercase tracking-widest">For Organizers</h3><div className="grid gap-1 text-[10px] text-[#c6c9ab]"><a href="#organizers">Host an Event</a><a href="#organizers">BoxOffice Access</a><a href="#organizers">Venue Partnerships</a><a href="#organizers">Door Entry Scanner</a></div></div><div><h3 className="mb-2 text-[8px] font-extrabold uppercase tracking-widest">Support & Legal</h3><div className="grid gap-1 text-[10px] text-[#c6c9ab]"><a href="#footer">Help Center</a><a href="#footer">Terms of Service</a><a href="#footer">Privacy Policy</a><a href="#footer">Ticket Purchase Policy</a></div></div><div className="flex justify-between text-[8px] font-extrabold uppercase tracking-widest text-[#c6c9ab] sm:col-span-2 lg:col-span-4"><span>© 2025 BuzzBox Ticketing Architecture. All rights reserved.</span><span>Delhi NCR · Mumbai · Bengaluru</span></div></div></footer>
    {notice && <div role="status" className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 border border-[#454932] bg-[#1b1b1f] px-4 py-3 text-xs text-[#e4e1e7] shadow-[4px_4px_0_#000]">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')} className="ml-3 text-[#d2f000]">×</button></div>}
  </div>
}
