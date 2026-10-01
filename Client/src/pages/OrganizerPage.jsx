import useApp from "../state/useApp";
import Page from "../components/Page";

export default function OrganizerPage() {
  const app = useApp();
  const {
    tab,
    setTab,
    go,
    eventForm,
    setEventForm,
    editingEvent,
    setEditingEvent,
    createdEvents,
    setCreatedEvents,
    setNotice,
    notice,
    money,
    ticketForm,
    setTicketForm,
    ticketTypes,
    setTicketTypes,
    couponForm,
    setCouponForm,
    coupons,
    setCoupons,
    waitlistEmail,
    setWaitlistEmail,
    waitlist,
    setWaitlist,
    bookings,
  } = app;
  const saveEvent = (event) => {
    event.preventDefault();
    const next = {
      id: editingEvent || `local-${createdEvents.length + 1}`,
      title: eventForm.title.trim(),
      date: eventForm.date,
      price: Number(eventForm.price),
      place: "Venue to be confirmed",
      category: "Community",
      time: "Time to be confirmed",
      description: "Organizer-created sample event.",
      art: "paper",
      tag: "ORGANIZER DEMO",
    };
    setCreatedEvents((items) =>
      editingEvent
        ? items.map((item) => (item.id === editingEvent ? next : item))
        : [next, ...items],
    );
    setNotice(editingEvent ? "Sample event updated." : "Sample event created.");
    setEventForm({ title: "", date: "", price: "" });
    setEditingEvent("");
  };
  const saveTicket = (event) => {
    event.preventDefault();
    setTicketTypes((list) => [
      {
        id: `tier-${list.length + 1}`,
        name: ticketForm.name.trim(),
        price: Number(ticketForm.price),
        quantity: Number(ticketForm.quantity),
      },
      ...list,
    ]);
    setTicketForm({ name: "", price: "", quantity: "" });
    setNotice("Sample ticket type added.");
  };
  const saveCoupon = (event) => {
    event.preventDefault();
    const code = couponForm.code.trim().toUpperCase();
    if (!/^[A-Z0-9]{4,16}$/.test(code)) {
      setNotice("Use 4 to 16 letters or numbers for a coupon code.");
      return;
    }
    if (coupons.some((c) => c.code === code)) {
      setNotice("That coupon code already exists.");
      return;
    }
    setCoupons((list) => [
      ...list,
      {
        code,
        percent: Number(couponForm.percent),
        minimum: Number(couponForm.minimum),
      },
    ]);
    setCouponForm({ code: "", percent: 10, minimum: 0 });
    setNotice("Demo coupon created.");
  };
  const saveWaitlist = (event) => {
    event.preventDefault();
    const email = waitlistEmail.trim().toLowerCase();
    if (waitlist.some((item) => item.email === email)) {
      setNotice("That email is already on this local demo list.");
      return;
    }
    setWaitlist((list) => [
      { email, addedOn: new Date().toLocaleDateString("en-IN") },
      ...list,
    ]);
    setWaitlistEmail("");
    setNotice("Added to the local demo waitlist.");
  };
  return (
    <Page
      title="Studio for organizers"
      eyebrow="LOCAL DEMO WORKSPACE"
      description="Organizer tools use sample data stored in this browser."
    >
      <div className="workspace-tabs">
        {["Attendee", "Organizer", "Admin"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => {
              setTab(item);
              if (item === "Attendee") go("/");
              else go(`/${item.toLowerCase()}`);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="dashboard-grid">
        <form className="panel" onSubmit={saveEvent}>
          <p className="eyebrow">EVENT SETUP · DEMO</p>
          <h2>{editingEvent ? "Edit sample event" : "Create an event"}</h2>
          <label className="field-label">
            Event title
            <input
              required
              minLength="3"
              maxLength="90"
              value={eventForm.title}
              onChange={(event) =>
                setEventForm({ ...eventForm, title: event.target.value })
              }
            />
          </label>
          <label className="field-label">
            Date
            <input
              required
              type="date"
              value={eventForm.date}
              onChange={(event) =>
                setEventForm({ ...eventForm, date: event.target.value })
              }
            />
          </label>
          <label className="field-label">
            Starting ticket price (INR)
            <input
              required
              type="number"
              min="0"
              max="1000000"
              value={eventForm.price}
              onChange={(event) =>
                setEventForm({ ...eventForm, price: event.target.value })
              }
            />
          </label>
          <div className="form-actions">
            <button className="button primary">
              {editingEvent ? "Save changes" : "Create sample event"}
            </button>
            {editingEvent && (
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setEditingEvent("");
                  setEventForm({ title: "", date: "", price: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
          {notice && (
            <p className="success-text" role="status">
              {notice}
            </p>
          )}
          <p className="demo-note">
            New events remain in local browser storage and do not appear in
            Explore.
          </p>
        </form>
        <div className="panel">
          <p className="eyebrow">YOUR SAMPLE EVENTS</p>
          <h2>Event management</h2>
          {createdEvents.length ? (
            createdEvents.map((event) => (
              <div className="admin-row" key={event.id}>
                <span>
                  <b>{event.title}</b>
                  <small>
                    {event.date} · {money(event.price)}
                  </small>
                </span>
                <div className="row-actions">
                  <button
                    className="text-link"
                    onClick={() => {
                      setEditingEvent(event.id);
                      setEventForm({
                        title: event.title,
                        date: event.date,
                        price: String(event.price),
                      });
                      window.scrollTo(0, 0);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-link danger-link"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete the sample event “${event.title}”?`,
                        )
                      )
                        setCreatedEvents((list) =>
                          list.filter((item) => item.id !== event.id),
                        );
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="body-copy">
              No organizer events yet. Create a sample event using the form.
            </p>
          )}
          <h3 className="subhead">Ticket types</h3>
          <form className="coupon-admin" onSubmit={saveTicket}>
            <label className="field-label">
              Ticket name
              <input
                required
                maxLength="50"
                value={ticketForm.name}
                onChange={(event) =>
                  setTicketForm({ ...ticketForm, name: event.target.value })
                }
                placeholder="For example, Balcony"
              />
            </label>
            <div className="field-pair">
              <label className="field-label">
                Price (INR)
                <input
                  required
                  type="number"
                  min="0"
                  value={ticketForm.price}
                  onChange={(event) =>
                    setTicketForm({ ...ticketForm, price: event.target.value })
                  }
                />
              </label>
              <label className="field-label">
                Sample quantity
                <input
                  required
                  type="number"
                  min="1"
                  max="100000"
                  value={ticketForm.quantity}
                  onChange={(event) =>
                    setTicketForm({
                      ...ticketForm,
                      quantity: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <button className="button secondary">Add ticket type</button>
          </form>
          {ticketTypes.map((type) => (
            <div className="admin-row" key={type.id}>
              <span>
                <b>{type.name}</b>
                <small>
                  {money(type.price)} · sample quantity {type.quantity}
                </small>
              </span>
              {type.id !== "general" && (
                <button
                  className="text-link danger-link"
                  onClick={() => {
                    if (window.confirm(`Remove ticket type ${type.name}?`))
                      setTicketTypes((list) =>
                        list.filter((item) => item.id !== type.id),
                      );
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <h3 className="subhead">Coupon management</h3>
          <form className="coupon-admin" onSubmit={saveCoupon}>
            <label className="field-label">
              Code
              <input
                required
                maxLength="16"
                value={couponForm.code}
                onChange={(event) =>
                  setCouponForm({ ...couponForm, code: event.target.value })
                }
                placeholder="For example, ART15"
              />
            </label>
            <div className="field-pair">
              <label className="field-label">
                Discount %
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={couponForm.percent}
                  onChange={(event) =>
                    setCouponForm({
                      ...couponForm,
                      percent: event.target.value,
                    })
                  }
                />
              </label>
              <label className="field-label">
                Minimum order (INR)
                <input
                  type="number"
                  min="0"
                  value={couponForm.minimum}
                  onChange={(event) =>
                    setCouponForm({
                      ...couponForm,
                      minimum: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <button className="button secondary">Add demo coupon</button>
          </form>
          {coupons.map((item) => (
            <div className="admin-row" key={item.code}>
              <span>
                <b>{item.code}</b>
                <small>
                  {item.percent}% off · minimum {money(item.minimum)}
                </small>
              </span>
              {item.code !== "WELCOME10" && (
                <button
                  className="text-link danger-link"
                  onClick={() => {
                    if (window.confirm(`Remove coupon ${item.code}?`))
                      setCoupons((list) =>
                        list.filter((coupon) => coupon.code !== item.code),
                      );
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="panel full-panel">
        <p className="eyebrow">WAITLIST · LOCAL DEMO</p>
        <h2>Join the sample waitlist</h2>
        <p className="body-copy">
          This form stores interest locally. It does not send email or reserve a
          place.
        </p>
        <form className="waitlist-form" onSubmit={saveWaitlist}>
          <label className="field-label">
            Email address
            <input
              required
              type="email"
              value={waitlistEmail}
              onChange={(event) => setWaitlistEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <button className="button primary">Join demo waitlist</button>
        </form>
        {notice && (
          <p className="success-text" role="status">
            {notice}
          </p>
        )}
        {waitlist.length ? (
          waitlist.map((item, index) => (
            <div className="admin-row" key={`${item.email}-${index}`}>
              <span>
                {item.email}
                <small>Added {item.addedOn} · sample data</small>
              </span>
              <button
                className="text-link danger-link"
                onClick={() => {
                  if (
                    window.confirm(`Remove ${item.email} from this demo list?`)
                  )
                    setWaitlist((list) => list.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="quiet">No sample signups yet.</p>
        )}
      </div>
      <div className="panel full-panel">
        <p className="eyebrow">BOOKING SNAPSHOT · DEMO ONLY</p>
        <h2>Activity from this browser</h2>
        <div className="demo-stat-row">
          <div>
            <b>{bookings.length}</b>
            <span>demo bookings</span>
          </div>
          <div>
            <b>
              {money(
                bookings.reduce(
                  (sum, item) => sum + Number(item.total || 0),
                  0,
                ),
              )}
            </b>
            <span>demo order totals</span>
          </div>
          <div>
            <b>
              {bookings.reduce((sum, item) => sum + Number(item.qty || 0), 0)}
            </b>
            <span>demo tickets</span>
          </div>
        </div>
        <p className="demo-note">
          These totals are calculated from local demo bookings only. They are
          not sales, attendance, or business analytics.
        </p>
      </div>
    </Page>
  );
}
