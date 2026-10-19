import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import HomePage from './pages/HomePage.jsx'
import EventDetailsPage from './pages/EventDetailsPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/explore" replace />} />
    <Route path="/explore" element={<HomePage />} />
    <Route path="/events/:eventId" element={<EventDetailsPage />} />
    <Route path="/checkout/:eventId" element={<CheckoutPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="*" element={<Navigate to="/explore" replace />} />
  </Routes>
}
