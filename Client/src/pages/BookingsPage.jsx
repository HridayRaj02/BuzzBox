import useApp from "../state/useApp";
import Page from "../components/Page";
import Empty from "../components/Empty";

export default function BookingsPage() {
  const { bookings, events, setSelectedEvent, go, money } = useApp();
  return (
    <Page
      title="Your bookings"
      eyebrow="YOUR PLANS, IN ONE PLACE"
      description="Bookings created in this browser's demo flow."
    >
      {bookings.length ? (
        <div className="booking-list">
          {bookings.map((booking) => {
            const event =
              events.find((item) => item.id === booking.event) || events[0];
            return (
              <article className="booking-row" key={booking.ref}>
                <div className={`mini-art ${event.art}`}></div>
                <div className="grow">
                  <p className="eyebrow">{booking.status.toUpperCase()}</p>
                  <h3>{event.title}</h3>
                  <p>
                    {booking.date} · {booking.qty} ticket
                    {booking.qty > 1 ? "s" : ""}
                  </p>
                </div>
                <b>{money(booking.total)}</b>
                <button
                  className="button secondary"
                  onClick={() => {
                    setSelectedEvent(event.id);
                    go("/confirmation");
                  }}
                >
                  Ticket
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No bookings yet"
          body="When you book an event, it will show up here."
          action="Find an event"
          onAction={() => go("/")}
        />
      )}
    </Page>
  );
}
