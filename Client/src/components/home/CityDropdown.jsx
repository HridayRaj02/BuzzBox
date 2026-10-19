import { useEffect, useRef, useState } from 'react'
import { cityOptions } from '../../data/cities.js'

export default function CityDropdown({ value, onChange, variant = 'search' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const header = variant === 'header'
  return <div ref={rootRef} className={`relative ${open ? 'z-[80]' : ''}`}>
    <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={header ? 'flex max-w-40 items-center gap-1.5 rounded-full bg-[#1b1b1f] px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-[#e4e1e7]' : 'flex w-full items-center justify-between gap-2 bg-transparent text-left font-[Epilogue] text-sm font-bold text-[#e4e1e7] outline-none'}>
      <span className="truncate">{header ? `⌖ ${value}` : value}</span><span aria-hidden="true">⌄</span>
    </button>
    {open && <div role="listbox" aria-label="Choose a city" className={`absolute top-full z-[80] mt-2 max-h-[min(65vh,22rem)] w-56 overflow-y-auto overscroll-contain rounded-lg border border-white/10 bg-[#2a292e] p-1 shadow-2xl ${header ? 'right-0' : 'left-0'}`}>
      {cityOptions.map((city) => <button key={city} type="button" role="option" aria-selected={value === city} onClick={() => { onChange(city); setOpen(false) }} className="flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-xs text-white transition hover:bg-[#3a393f] focus:bg-[#3a393f] focus:outline-none">
        <span>{city}</span>{value === city && <span aria-hidden="true" className="font-bold text-[#d2f000]">✓</span>}
      </button>)}
    </div>}
  </div>
}
