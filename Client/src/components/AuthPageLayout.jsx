import buzzboxLogo from '../../../BUZZ BOX LOGO.png'
import { Link } from 'react-router-dom'
import { tw } from '../styles/tailwind.js'

const events = [
  { place: 'OKHLA WAREHOUSE 09', name: 'Subverse Modular IV', detail: '₹1,499 · FAST SELLING', active: true },
  { place: 'INDY LISTENING ROOM', name: 'Vinyl Wax & Dub Club', detail: '₹899 · FINAL 20 TIX', urgent: true },
  { place: 'DHAN MILL COMPOUND', name: 'Neon Ambient Session', detail: 'INVITE ONLY PASS', active: true },
]

function EventShowcase() {
  return (
    <section className="flex min-w-0 flex-col justify-between py-1 sm:py-4">
      <div>
        <div className="inline-flex items-center rounded-full bg-[#222228] px-3 py-2 text-[9px] font-extrabold tracking-[.13em] text-[#dfff00]">
          <span className="mr-2 size-1.5 rounded-full bg-[#dfff00]" />LIVE RADAR <span className="mx-1.5 text-neutral-500">·</span> DELHI NCR <span className="mx-1.5 text-neutral-500">·</span> MUMBAI <span className="mx-1.5 text-neutral-500">·</span> BLR
        </div>
        <p className="mb-3 mt-6 text-[10px] font-extrabold tracking-[.2em] text-[#dfff00]">SUBTERRANEAN TICKETING NETWORK</p>
        <h1 className="font-[Epilogue] text-[clamp(2.45rem,4.3vw,3.9rem)] leading-[.99] font-extrabold tracking-[-.065em] text-[#f4f2e9]">UNBOX THE<br />SOUND, THE SPACE,<br />AND THE <span className="text-[#dfff00]">SCENE.</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#b5b4b0]">Direct-to-vault access for warehouse raves, secret listening bars, audio-visual labs, and bespoke after-hours across urban India.</p>
      </div>

      <div className="my-6">
        <div className="mb-2 flex items-center justify-between gap-2 text-[9px] font-extrabold tracking-[.13em] text-[#aaa99f]"><span>◉ &nbsp; RADAR DROP / HAPPENING TONIGHT</span><span className="text-[#dfff00]">14 ENCLAVES ONLINE</span></div>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          {events.map((event) => <article className={tw.eventCard} key={event.name}>
            <div className={tw.eventLabel}>{event.place}<span className={`size-1.5 rounded-full ${event.urgent ? 'bg-[#ff534a]' : 'bg-[#dfff00]'}`} /></div>
            <h2 className={tw.eventTitle}>{event.name}</h2>
            <p className={tw.eventDetail}>{event.detail}</p>
          </article>)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 border border-[#232329] bg-[#19191e] p-3 sm:p-[18px]">
        <div><strong className={`${tw.proofValue} text-[#f2f1eb]`}>CURATED</strong><span className={tw.proofLabel}>VERIFIED ACCESS</span></div>
        <div><strong className={`${tw.proofValue} text-[#dfff00]`}>FAST ENTRY</strong><span className={tw.proofLabel}>DYNAMIC QR CODES</span></div>
        <div><strong className={`${tw.proofValue} text-[#f2f1eb]`}>ENCRYPTED</strong><span className={tw.proofLabel}>SECURE DIGITAL VAULT</span></div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[8px] font-extrabold tracking-[.13em] text-[#a5a49c]"><span>♫ &nbsp; CURATED FOR DISCERNING NIGHT CRAWLERS</span><span className="tracking-[.25em] text-[#dfff00]">▂ ▄ ▂ ▆ ▃ ▅ ▂</span></div>
    </section>
  )
}

export default function AuthPageLayout({ children }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#101014] text-[#f3f2eb] [background-image:radial-gradient(ellipse_50%_42%_at_48%_42%,#17171d_0%,#101014_76%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(#393940_1px,transparent_1px)] [background-size:23px_23px]" />
      <header className="mx-auto flex h-[70px] w-full max-w-[1440px] items-center justify-between border-b border-white/5 px-[18px] sm:h-[82px] sm:px-7 xl:px-[50px]">
        <Link className="inline-flex items-center" to="/login" aria-label="BuzzBox login"><img className="h-[38px] w-auto max-w-[190px] object-contain" src={buzzboxLogo} alt="BuzzBox" /></Link>
        <div className="hidden text-[10px] font-extrabold tracking-[.16em] text-[#a7a79d] sm:block"><span className="mr-2 text-[#dfff00]">⌖</span>DELHI NCR <i className="mx-2 inline-block h-3 w-px bg-[#46464a]" /> MUMBAI <i className="mx-2 inline-block h-3 w-px bg-[#46464a]" /> BLR</div>
        <div className="rounded border border-[#35353a] bg-[#19191d] px-2.5 py-2 text-[8px] font-extrabold tracking-[.13em] text-[#aaa99f] sm:px-3"><span className="mr-2 inline-block size-1.5 rounded-full bg-[#dfff00]" />NODE 01 ACTIVE</div>
      </header>
      <main className="mx-auto grid w-[calc(100%-2rem)] max-w-[1270px] flex-1 grid-cols-1 content-center items-center gap-7 py-7 sm:w-[calc(100%-3.5rem)] sm:py-9 lg:grid-cols-[minmax(0,1fr)_425px] lg:gap-[68px] lg:py-8">
        <EventShowcase />
        {children}
      </main>
      <footer className="mx-auto flex min-h-[60px] w-full max-w-[1440px] flex-wrap items-center justify-center gap-3 border-t border-white/5 px-[18px] py-3 text-center text-[8px] font-bold tracking-[.12em] text-[#77776f] sm:justify-between sm:px-7 xl:px-[50px]">
        <span>© 2025 BUZZBOX CULTURE NETWORK</span><div className="flex gap-4 sm:gap-[22px]"><a className="hover:text-[#dfff00]" href="#terms">TERMS</a><a className="hover:text-[#dfff00]" href="#privacy">PRIVACY</a><a className="hover:text-[#dfff00]" href="#security">SECURITY</a></div><span className="hidden sm:inline">MADE FOR THE AFTER HOURS <b className="ml-1 text-xs text-[#dfff00]">✳</b></span>
      </footer>
    </div>
  )
}
