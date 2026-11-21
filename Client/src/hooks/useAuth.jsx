// Provides session state and login/logout actions to every page.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './useAuthContext.js'
import { api, ApiError } from '../lib/api.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => {
    try { const result = await api('/api/auth/me'); setUser(result.user); return result.user }
    catch (error) { if (error instanceof ApiError && error.status === 401) setUser(null); else throw error }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { Promise.resolve().then(refresh).catch(() => setUser(null)) }, [refresh])
  const value = useMemo(() => ({
    user, loading,
    login: async (email, password) => { const result = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); setUser(result.user); return result.user },
    signup: async (details) => { const result = await api('/api/auth/signup', { method: 'POST', body: JSON.stringify(details) }); setUser(result.user); return result.user },
    logout: async () => { try { await api('/api/auth/logout', { method: 'POST' }) } finally { setUser(null) } },
    refresh,
  }), [user, loading, refresh])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

