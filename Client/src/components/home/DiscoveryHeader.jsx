import { Link, NavLink, useLocation } from 'react-router-dom'
import buzzboxLogo from '../../../../BUZZ BOX LOGO.png'
import CityDropdown from './CityDropdown.jsx'
import { useAuth } from '../../hooks/useAuthContext.js'

const links = [['Explore', '/explore'], ['Events', '/explore#radar'], ['Experiences', '/explore#experiences'], ['Radar', '/explore#nearby'], ['Profile', '/profile']]

export default function DiscoveryHeader({ city, onCityChange }) {
  const location = useLocation()
  const { user } = useAuth()
  const active = location.pathname === '/profile' ? 'Profile' : 'Explore'
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#131317]/95 shadow-[0_1px_8px_rgba(0,0,0,.4)] backdrop-blur-xl">
    <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-7 lg:h-20 lg:px-12">
      <div className="flex min-w-0 items-center gap-4 lg:gap-9">
        <Link to="/explore" className="flex shrink-0 items-center gap-2" aria-label="BuzzBox explore"><img className="h-8 w-auto max-w-24 object-contain" src={buzzboxLogo} alt="BuzzBox"/><span className="hidden font-[Epilogue] text-sm font-extrabold uppercase tracking-tight sm:inline">BuzzBox</span></Link>
        <nav className="hidden items-center gap-1 lg:flex">{links.map(([label, href]) => <NavLink key={label} to={href} end={label === 'Explore'} className={`rounded-full px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider transition ${(label === active || (label === 'Profile' && location.pathname.startsWith('/profile'))) ? 'bg-[#e4e1e7] text-[#303034]' : 'text-[#c6c9ab] hover:bg-[#2a292e] hover:text-white'}`}>{label}</NavLink>)}</nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/host" className="hidden text-[9px] font-extrabold uppercase tracking-widest text-[#c6c9ab] hover:text-white xl:inline">Become a Host / Organizer</Link>
        <CityDropdown variant="header" value={city} onChange={onCityChange} />
        <a href="#footer" aria-label="Help" className="hidden text-sm text-[#c6c9ab] sm:block">ⓘ</a>
        <Link to={user ? '/profile' : '/login'} aria-label="Profile" className="grid size-8 place-items-center overflow-hidden rounded-full bg-[#e4e1e7] text-sm text-[#131317]">{user?.photo ? <img src={user.photo} alt="" className="size-full object-cover"/> : '♙'}</Link>
      </div>
    </div>
  </header>
}
