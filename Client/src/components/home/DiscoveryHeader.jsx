import { Link } from 'react-router-dom'
import buzzboxLogo from '../../../../BUZZ BOX LOGO.png'
import CityDropdown from './CityDropdown.jsx'

const links = [['Explore', '#top'], ['Events', '#radar'], ['Experiences', '#experiences'], ['Radar', '#nearby']]

export default function DiscoveryHeader({ city, onCityChange }) {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#131317]/95 shadow-[0_1px_8px_rgba(0,0,0,.4)] backdrop-blur-xl">
    <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-7 lg:h-20 lg:px-12">
      <div className="flex min-w-0 items-center gap-4 lg:gap-9">
        <Link to="/explore" className="flex shrink-0 items-center gap-2" aria-label="BuzzBox explore"><img className="h-8 w-auto max-w-24 object-contain" src={buzzboxLogo} alt="BuzzBox"/><span className="hidden font-[Epilogue] text-sm font-extrabold uppercase tracking-tight sm:inline">BuzzBox</span></Link>
        <nav className="hidden items-center gap-1 lg:flex">{links.map(([label, href], index) => <a key={label} href={href} className={`rounded-full px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider transition ${index === 0 ? 'bg-[#e4e1e7] text-[#303034]' : 'text-[#c6c9ab] hover:bg-[#2a292e] hover:text-white'}`}>{label}</a>)}</nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <a href="#organizers" className="hidden text-[9px] font-extrabold uppercase tracking-widest text-[#c6c9ab] hover:text-white xl:inline">Become a Host / Organizer</a>
        <CityDropdown variant="header" value={city} onChange={onCityChange} />
        <a href="#footer" aria-label="Help" className="hidden text-sm text-[#c6c9ab] sm:block">ⓘ</a>
        <Link to="/login" aria-label="Preview sign-in" className="grid size-8 place-items-center rounded-full bg-[#e4e1e7] text-sm text-[#131317]">♙</Link>
      </div>
    </div>
  </header>
}
