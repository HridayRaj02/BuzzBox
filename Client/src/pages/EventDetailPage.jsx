import useApp from "../state/useApp";

export default function EventDetailPage() {
  const { chosen, go, qty, setQty, checkout, wishlist, toggleWish, money } =
    useApp();
  return (
    <section className="event-detail">
      <button className="back-link" onClick={() => go("/")}>
        ← Explore events
      </button>
      <div className={`detail-art artwork ${chosen.art}`}>
        <span className="art-label">{chosen.tag}</span>
        <span className="art-glyph" aria-hidden="true">
          ◌
        </span>
      </div>
      <div className="detail-columns">
        <div>
          <p className="eyebrow">{chosen.category} · DELHI NCR</p>
          <h1>{chosen.title}</h1>
          <p className="lede">{chosen.description}</p>
          <div className="detail-info">
            <div>
              <span>Date & time</span>
              <b>
                {chosen.date} · {chosen.time}
              </b>
            </div>
            <div>
              <span>Venue</span>
              <b>{chosen.place}</b>
            </div>
            <div>
              <span>Presented by</span>
              <b>BuzzBox community pick</b>
            </div>
          </div>
          <h2>About this event</h2>
          <p className="body-copy">
            A small, considered gathering for people who enjoy spending time
            with culture. Arrive a little early, settle in, and enjoy the
            programme at your own pace.
          </p>
          <p className="demo-note">
            Event details shown are sample content for this frontend demo.
          </p>
        </div>
        <aside className="booking-box">
          <p className="eyebrow">TICKETS</p>
          <h3>General admission</h3>
          <p className="quiet">Entry for one person</p>
          <div className="price-line">
            <strong>{money(chosen.price)}</strong>
            <span>per person</span>
          </div>
          <div className="quantity">
            <span>Quantity</span>
            <div>
              <button
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <b>{qty}</b>
              <button
                onClick={() => setQty((value) => Math.min(8, value + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          <button
            className="button primary full"
            onClick={() => checkout(chosen.id)}
          >
            Continue to checkout
          </button>
          <button
            className="button secondary full"
            onClick={() => toggleWish(chosen.id)}
          >
            {wishlist.includes(chosen.id)
              ? "♥ Saved to wishlist"
              : "♡ Save for later"}
          </button>
          <p className="fine-print">
            Demo booking only. No payment will be taken.
          </p>
        </aside>
      </div>
    </section>
  );
}
