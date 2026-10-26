import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import HomePage from './pages/HomePage.jsx'
import EventDetailsPage from './pages/EventDetailsPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ExperiencePage from './pages/ExperiencePage.jsx'
import RadarPage from './pages/RadarPage.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { useAuth } from './hooks/useAuthContext.js'
import { useScrollToTop } from './hooks/useScrollToTop.js'

function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  return user ? children : <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
}

function RouteViews() {
  useScrollToTop()
  return <Routes>
    <Route path="/" element={<Navigate to="/explore" replace />} />
    <Route path="/explore" element={<HomePage />} />
    <Route path="/experience" element={<ExperiencePage />} />
    <Route path="/radar" element={<RadarPage />} />
    <Route path="/events/:eventId" element={<EventDetailsPage />} />
    <Route path="/checkout/:eventId" element={<CheckoutPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
    <Route path="/profile/:view" element={<RequireAuth><ProfilePage /></RequireAuth>} />
    <Route path="/host" element={<RequireAuth><main className="min-h-screen bg-[#131317] p-12 text-[#e4e1e7]"><h1 className="font-[Epilogue] text-3xl font-extrabold">HOST / ORGANIZER</h1><p className="mt-3 text-[#c6c9ab]">Organizer onboarding is coming soon.</p></main></RequireAuth>} />
    <Route path="/u/:handle" element={<ProfilePage publicView />} />
    <Route path="*" element={<Navigate to="/explore" replace />} />
  </Routes>
}

export default function App() {
  return <AuthProvider><RouteViews /></AuthProvider>
}
