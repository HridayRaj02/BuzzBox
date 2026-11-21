// Loads and updates the authenticated user's dashboard data in one place.
import { useCallback, useEffect, useState } from 'react'
import { profileDisplayDefaults } from '../data/profileDisplayDefaults.js'
import { api, ApiError, mapEvent } from '../lib/api.js'

function hydrate(user) {
  return {
    ...profileDisplayDefaults,
    ...user,
    city: user.city?.name || profileDisplayDefaults.city,
    cityId: user.city?.id || null,
    photo: user.photoUrl || profileDisplayDefaults.photo,
    favouriteGenres: user.favouriteGenres || [],
    cityPreferences: user.cityPreferences || [],
    notifications: { ...profileDisplayDefaults.notifications, ...user.notifications },
    security: { ...profileDisplayDefaults.security, phone: user.phone || profileDisplayDefaults.security.phone, connectedIdentity: user.email || profileDisplayDefaults.security.connectedIdentity },
  }
}

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [savedEvents, setSavedEvents] = useState([])
  const [waitlist, setWaitlist] = useState([])
  const [bookings, setBookings] = useState([])
  const reload = useCallback(async () => {
    setError(false)
    try {
      const [result, saved, waitlistEntries, bookingEntries] = await Promise.all([api('/api/auth/me'), api('/api/me/saved-events'), api('/api/me/waitlist'), api('/api/me/bookings')])
      setUser(hydrate(result.user))
      setSavedEvents(saved.map(mapEvent))
      setWaitlist(waitlistEntries.map((entry) => ({ ...entry, event: mapEvent(entry.event) })))
      setBookings(bookingEntries.map((booking) => ({ ...booking, event: mapEvent(booking.event) })))
    } catch (requestError) { setError(!(requestError instanceof ApiError && requestError.status === 401)); setUser(null); setSavedEvents([]); setWaitlist([]); setBookings([]) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { Promise.resolve().then(reload) }, [reload])

  const updateUser = useCallback(async (changes) => {
    const payload = {}
    if (changes.name !== undefined) payload.name = changes.name
    if (changes.handle !== undefined) payload.handle = changes.handle
    if (changes.favouriteGenres !== undefined) payload.favouriteGenres = changes.favouriteGenres
    if (changes.cityPreferences !== undefined) payload.cityPreferences = changes.cityPreferences
    if (changes.notifications !== undefined) payload.notifications = changes.notifications
    if (changes.city !== undefined) {
      const cities = await api('/api/cities')
      const city = cities.find((item) => item.name === changes.city)
      if (!city) throw new Error(`${changes.city} is not currently available on BuzzBox.`)
      payload.cityId = city.id
    }
    const result = await api('/api/me', { method: 'PATCH', body: JSON.stringify(payload) })
    const next = hydrate(result.user)
    setUser(next)
    if (next.city) localStorage.setItem('buzzbox:city', next.city)
    return next
  }, [])

  const updateSetting = useCallback((setting, value) => updateUser({ notifications: { [setting]: value } }), [updateUser])
  const setEventSaved = useCallback(async (eventId, saved) => {
    await api(`/api/events/${eventId}/saved`, { method: saved ? 'PUT' : 'DELETE' })
    if (saved) { const result = await api('/api/me/saved-events'); setSavedEvents(result.map(mapEvent)) }
    else setSavedEvents((current) => current.filter((event) => event.eventId !== eventId))
  }, [])
  const leaveWaitlist = useCallback(async (eventId) => {
    await api(`/api/events/${eventId}/waitlist`, { method: 'DELETE' })
    setWaitlist((current) => current.filter((entry) => entry.eventId !== eventId))
  }, [])
  return { user, loading, error, savedEvents, waitlist, bookings, reload, updateUser, updateSetting, setEventSaved, leaveWaitlist }
}
