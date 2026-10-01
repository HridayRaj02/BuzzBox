import useApp from "../state/useApp";
import Page from "../components/Page";

export default function AdminPage() {
  const {
    tab,
    setTab,
    go,
    events,
    eventStatus,
    setEventStatus,
    createdEvents,
    setCreatedEvents,
    profile,
    userSuspended,
    setUserSuspended,
    bookings,
    notifications,
  } = useApp();
  return (
    <Page
      title="Admin workspace"
      eyebrow="LOCAL DEMO WORKSPACE"
      description="Review local sample data. These actions have no effect on real users or public listings."
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
      <div className="admin-workspace">
        <div className="panel">
          <p className="eyebrow">MODERATION · LOCAL DEMO</p>
          <h2>Events</h2>
          <p className="body-copy">
            Sample catalog records can be hidden in this demo interface. No
            public event listing changes.
          </p>
          {events.map((event) => {
            const hidden = eventStatus[event.id] === "hidden";
            return (
              <div className="admin-row" key={event.id}>
                <span>
                  <b>{event.title}</b>
                  <small>
                    {hidden ? "Hidden in demo" : "Visible in demo"} ·{" "}
                    {event.date}
                  </small>
                </span>
                <button
                  className="button secondary"
                  onClick={() => {
                    const action = hidden ? "restore" : "hide";
                    if (
                      window.confirm(
                        `${action === "hide" ? "Hide" : "Restore"} “${event.title}” in this demo?`,
                      )
                    )
                      setEventStatus((status) => ({
                        ...status,
                        [event.id]: hidden ? "visible" : "hidden",
                      }));
                  }}
                >
                  {hidden ? "Restore" : "Hide"}
                </button>
              </div>
            );
          })}
          {createdEvents.map((event) => (
            <div className="admin-row" key={event.id}>
              <span>
                <b>{event.title}</b>
                <small>Organizer draft · local browser</small>
              </span>
              <button
                className="button secondary"
                onClick={() => {
                  if (
                    window.confirm(
                      `Remove the organizer sample “${event.title}”?`,
                    )
                  )
                    setCreatedEvents((items) =>
                      items.filter((item) => item.id !== event.id),
                    );
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="panel">
          <p className="eyebrow">ACCOUNT REVIEW · LOCAL DEMO</p>
          <h2>Demo profile</h2>
          <div className="admin-row">
            <span>
              <b>{profile.name || "Guest"}</b>
              <small>
                {profile.email || "No email supplied"} · browser-local profile
              </small>
            </span>
            <button
              className="button secondary"
              onClick={() => {
                if (
                  window.confirm(
                    `${userSuspended ? "Restore" : "Suspend"} this demo profile locally?`,
                  )
                )
                  setUserSuspended((value) => !value);
              }}
            >
              {userSuspended ? "Restore profile" : "Suspend profile"}
            </button>
          </div>
          <p className="demo-note">
            Profile status:{" "}
            {userSuspended
              ? "Suspended in this browser demo"
              : "Active in this browser demo"}
            . No real account is changed.
          </p>
          <h3 className="subhead">Moderation notes</h3>
          <p className="body-copy">
            No reports or user-submitted listings are connected. This workspace
            contains sample catalog items only.
          </p>
        </div>
        <div className="panel">
          <p className="eyebrow">DEMO COUNTS</p>
          <h2>Local records</h2>
          <div className="demo-stat-row">
            <div>
              <b>{events.length + createdEvents.length}</b>
              <span>catalog records</span>
            </div>
            <div>
              <b>{bookings.length}</b>
              <span>demo bookings</span>
            </div>
            <div>
              <b>{notifications.length}</b>
              <span>sample notices</span>
            </div>
          </div>
          <p className="demo-note">
            Counts reflect browser demo state and have no operational meaning.
          </p>
        </div>
      </div>
    </Page>
  );
}
