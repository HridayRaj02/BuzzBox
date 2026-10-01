import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { events, money, readLocal, writeLocal } from "../data/events";
import AppContext from "./appContext";

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(() =>
    readLocal("buzzbox-wishlist", []),
  );
  const [bookings, setBookings] = useState(() =>
    readLocal("buzzbox-bookings", []),
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All events");
  const [sort, setSort] = useState("Soonest");
  const [qty, setQty] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);
  const [notice, setNotice] = useState("");
  const [notifications, setNotifications] = useState(() =>
    readLocal("buzzbox-notifications", [
      {
        id: 1,
        title: "Welcome to BuzzBox",
        body: "This is a sample notification in your local demo inbox.",
        unread: true,
      },
    ]),
  );
  const [profile, setProfile] = useState(() =>
    readLocal("buzzbox-profile", { name: "Guest", email: "", city: "Delhi" }),
  );
  const [formError, setFormError] = useState("");
  const [tab, setTab] = useState("Attendee");
  const [authMode, setAuthMode] = useState("Sign in");
  const [selectedEvent, setSelectedEvent] = useState("raaga");
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    price: "",
  });
  const [createdEvents, setCreatedEvents] = useState(() =>
    readLocal("buzzbox-organizer-events", []),
  );
  const [coupons, setCoupons] = useState(() =>
    readLocal("buzzbox-organizer-coupons", [
      { code: "WELCOME10", percent: 10, minimum: 0 },
    ]),
  );
  const [ticketTypes, setTicketTypes] = useState(() =>
    readLocal("buzzbox-organizer-ticket-types", [
      { id: "general", name: "General admission", price: 850, quantity: 100 },
    ]),
  );
  const [ticketForm, setTicketForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [waitlist, setWaitlist] = useState(() =>
    readLocal("buzzbox-waitlist", []),
  );
  const [eventStatus, setEventStatus] = useState(() =>
    readLocal("buzzbox-admin-event-status", {}),
  );
  const [userSuspended, setUserSuspended] = useState(() =>
    readLocal("buzzbox-admin-user-suspended", false),
  );
  const [editingEvent, setEditingEvent] = useState("");
  const [couponForm, setCouponForm] = useState({
    code: "",
    percent: 10,
    minimum: 0,
  });
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [couponPercent, setCouponPercent] = useState(10);
  const [savedBooking, setSavedBooking] = useState(null);

  useEffect(() => {
    writeLocal("buzzbox-wishlist", wishlist);
  }, [wishlist]);
  useEffect(() => {
    writeLocal("buzzbox-bookings", bookings);
  }, [bookings]);
  useEffect(() => {
    writeLocal("buzzbox-notifications", notifications);
  }, [notifications]);
  useEffect(() => {
    writeLocal("buzzbox-profile", profile);
  }, [profile]);
  useEffect(() => {
    writeLocal("buzzbox-organizer-events", createdEvents);
  }, [createdEvents]);
  useEffect(() => {
    writeLocal("buzzbox-organizer-coupons", coupons);
  }, [coupons]);
  useEffect(() => {
    writeLocal("buzzbox-organizer-ticket-types", ticketTypes);
  }, [ticketTypes]);
  useEffect(() => {
    writeLocal("buzzbox-waitlist", waitlist);
  }, [waitlist]);
  useEffect(() => {
    writeLocal("buzzbox-admin-event-status", eventStatus);
  }, [eventStatus]);
  useEffect(() => {
    writeLocal("buzzbox-admin-user-suspended", userSuspended);
  }, [userSuspended]);

  const go = (path) => {
    navigate(path.startsWith("/") ? path : `/${path}`);
    window.scrollTo(0, 0);
    setNotice("");
  };
  const chosen =
    events.find((event) => event.id === selectedEvent) || events[0];
  const visible = useMemo(() => {
    const results = events.filter(
      (event) =>
        (category === "All events" || event.category === category) &&
        `${event.title} ${event.category} ${event.place}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    return sort === "Price: low to high"
      ? results.sort((a, b) => a.price - b.price)
      : sort === "Price: high to low"
        ? results.sort((a, b) => b.price - a.price)
        : results;
  }, [category, query, sort]);
  const subtotal = chosen.price * qty;
  const discount = applied ? Math.floor((subtotal * couponPercent) / 100) : 0;
  const toggleWish = (id) =>
    setWishlist((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  const checkout = (id) => {
    setSelectedEvent(id);
    setQty(1);
    setApplied(false);
    go("/checkout");
  };
  const payDemo = () => {
    const booking = {
      ref: `BB-DEMO-${String(bookings.length + 1).padStart(4, "0")}`,
      event: chosen.id,
      qty,
      date: chosen.date,
      total: subtotal - discount,
      status: "Demo booking",
    };
    setSavedBooking(booking);
    setBookings((items) => [booking, ...items]);
    go("/confirmation");
  };

  return (
    <AppContext.Provider
      value={{
        events,
        money,
        wishlist,
        setWishlist,
        bookings,
        setBookings,
        query,
        setQuery,
        category,
        setCategory,
        sort,
        setSort,
        qty,
        setQty,
        coupon,
        setCoupon,
        applied,
        setApplied,
        notice,
        setNotice,
        notifications,
        setNotifications,
        profile,
        setProfile,
        formError,
        setFormError,
        tab,
        setTab,
        authMode,
        setAuthMode,
        selectedEvent,
        setSelectedEvent,
        eventForm,
        setEventForm,
        createdEvents,
        setCreatedEvents,
        coupons,
        setCoupons,
        ticketTypes,
        setTicketTypes,
        ticketForm,
        setTicketForm,
        waitlist,
        setWaitlist,
        eventStatus,
        setEventStatus,
        userSuspended,
        setUserSuspended,
        editingEvent,
        setEditingEvent,
        couponForm,
        setCouponForm,
        waitlistEmail,
        setWaitlistEmail,
        couponPercent,
        setCouponPercent,
        savedBooking,
        setSavedBooking,
        go,
        chosen,
        visible,
        subtotal,
        discount,
        toggleWish,
        checkout,
        payDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
