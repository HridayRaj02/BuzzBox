import useApp from "../state/useApp";

export default function EventCard({ event }) {
  const { go, setSelectedEvent, wishlist, toggleWish, money } = useApp();
  const open = () => {
    setSelectedEvent(event.id);
    go("/event");
  };
  return (
    <article className="event-card">
      <button
        className={`artwork ${event.art}`}
        onClick={open}
        aria-label={`View ${event.title}`}
      >
        <span className="art-label">{event.tag}</span>
        <span className="art-glyph" aria-hidden="true">
          {event.art === "film"
            ? "▰"
            : event.art === "paper" || event.art === "print"
              ? "▧"
              : event.art === "supper"
                ? "◒"
                : "◌"}
        </span>
      </button>
      <div className="event-copy">
        <div className="event-meta">
          <span>{event.category}</span>
          <span>{event.date}</span>
        </div>
        <button className="event-title" onClick={open}>
          {event.title}
        </button>
        <p className="event-place">{event.place}</p>
        <div className="event-bottom">
          <span>
            From <b>{money(event.price)}</b>
          </span>
          <button
            className={`heart ${wishlist.includes(event.id) ? "saved" : ""}`}
            onClick={() => toggleWish(event.id)}
            aria-label={`${wishlist.includes(event.id) ? "Remove from" : "Add to"} wishlist`}
          >
            {wishlist.includes(event.id) ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  );
}
