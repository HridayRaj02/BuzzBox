import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollToTop() {
  const { pathname, key } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname, key])
}
