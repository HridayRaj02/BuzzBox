import useApp from "../state/useApp";
import Page from "../components/Page";

export default function ConfirmationPage() {
  const { chosen, savedBooking, bookings, qty, go } = useApp();
  const booking = savedBooking || bookings[0];
  return (
    <Page
      title="You're on the list."
      eyebrow="BOOKING CONFIRMATION"
      description="Your sample booking is saved on this device."
    >
      <article className="ticket">
        <div className={`ticket-art ${chosen.art}`}>
          <span>{chosen.tag}</span>
          <strong>{chosen.title}</strong>
        </div>
        <div className="ticket-body">
          <p className="eyebrow">DEMO TICKET · NOT VALID FOR ENTRY</p>
          <div className="ticket-data">
            <span>
              Date<b>{chosen.date}</b>
            </span>
            <span>
              Time<b>{chosen.time}</b>
            </span>
            <span>
              Tickets<b>{booking?.qty || qty}</b>
            </span>
            <span>
              Reference<b>{booking?.ref || "BB-DEMO"}</b>
            </span>
          </div>
          <p className="demo-note">
            This locally generated confirmation is sample data. It is not an
            entry credential.
          </p>
          <div className="ticket-actions">
            <button className="button secondary" onClick={() => window.print()}>
              Print ticket
            </button>
            <button className="button primary" onClick={() => go("/bookings")}>
              View my bookings
            </button>
          </div>
        </div>
      </article>
    </Page>
  );
}
