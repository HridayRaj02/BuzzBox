import { Outlet, useLocation } from "react-router-dom";
import useApp from "../state/useApp";

const desktopLinks = [
  ["Explore", "/"],
  ["Wishlist", "/wishlist"],
  ["My bookings", "/bookings"],
  ["Notifications", "/notifications"],
  ["Profile", "/profile"],
];

export default function AppLayout() {
  const { go, profile } = useApp();
  const { pathname } = useLocation();
  const navItem = (label, icon, path) => (
    <button
      className={`nav-item ${pathname === path ? "active" : ""}`}
      key={path}
      onClick={() => go(path)}
      aria-current={pathname === path ? "page" : undefined}
    >
      <span className="nav-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <button
          className="wordmark header-wordmark"
          onClick={() => go("/")}
          aria-label="BuzzBox home"
        >
          <img className="header-logo" src="/buzz-box-logo.png" alt="BuzzBox" />
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {desktopLinks.map(([label, path]) => (
            <button
              key={path}
              className={pathname === path ? "selected" : ""}
              aria-current={pathname === path ? "page" : undefined}
              onClick={() => go(path)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <span className="location">
            ⌖ <span>Delhi NCR</span>
          </span>
          <button
            className="avatar"
            onClick={() => go("/profile")}
            aria-label="Open profile"
          >
            {profile.name?.[0] || "G"}
          </button>
        </div>
      </header>
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <button className="wordmark" onClick={() => go("/")}>
          <span className="brand-mark small">B</span>
          <span>BuzzBox</span>
        </button>
        <p>Good things happen when you go.</p>
        <div>
          <button onClick={() => go("/privacy")}>Privacy</button>
          <button onClick={() => go("/terms")}>Terms</button>
          <button onClick={() => go("/organizer")}>For organizers</button>
          <button onClick={() => go("/admin")}>Admin demo</button>
        </div>
      </footer>
      <nav className="mobile-dock" aria-label="Mobile navigation">
        {navItem("Explore", "⌕", "/")}
        {navItem("Saved", "♡", "/wishlist")}
        {navItem("Bookings", "▤", "/bookings")}
        {navItem("Profile", "○", "/profile")}
      </nav>
    </div>
  );
}
