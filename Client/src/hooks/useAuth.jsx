import { useMemo, useState } from 'react'
import { AuthContext } from './useAuthContext.js'
const AUTH_KEY = 'buzzbox:user'
const initialUser = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null') } catch { return null } }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUser)
  const value = useMemo(() => ({
    user,
    login: (details = { name: 'Maya Sharma', email: 'maya@buzzbox.example' }) => {
      const next = { name: details.name || 'Maya Sharma', email: details.email || 'maya@buzzbox.example' }
      localStorage.setItem(AUTH_KEY, JSON.stringify(next)); setUser(next); return next
    },
    logout: () => { localStorage.removeItem(AUTH_KEY); setUser(null) },
  }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

