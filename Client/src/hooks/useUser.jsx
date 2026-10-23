import { useCallback, useState } from 'react'
import { MOCK_USER } from '../data/mockUser.js'

const KEY = 'buzzbox:profile'
const read = () => { try { return { ...MOCK_USER, ...JSON.parse(localStorage.getItem(KEY) || '{}'), notifications: { ...MOCK_USER.notifications, ...(JSON.parse(localStorage.getItem(KEY) || '{}').notifications || {}) } } } catch { return MOCK_USER } }
export function useUser() {
  const [user, setUser] = useState(read)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const reload = useCallback(() => { setLoading(true); setError(false); try { setUser(read()) } catch { setError(true) } finally { setLoading(false) } }, [])
  const updateUser = useCallback((changes) => { setUser((current) => { const next = { ...current, ...changes, notifications: { ...current.notifications, ...(changes.notifications || {}) } }; localStorage.setItem(KEY, JSON.stringify(next)); if (changes.city) localStorage.setItem('buzzbox:city', changes.city); return next }) }, [])
  const updateSetting = useCallback(async (setting, value) => { const previous = read().notifications; const next = { ...previous, [setting]: value }; try { localStorage.setItem(KEY, JSON.stringify({ ...read(), notifications: next })); setUser((current) => ({ ...current, notifications: next })) } catch (err) { setUser((current) => ({ ...current, notifications: previous })); throw err } }, [])
  return { user, loading, error, reload, updateUser, updateSetting }
}
