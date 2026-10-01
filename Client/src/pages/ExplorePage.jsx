import useApp from "../state/useApp";
import EventCard from "../components/EventCard";

export default function ExplorePage() {
  const { query, setQuery, sort, setSort, category, setCategory, visible } =
    useApp();
  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">A GOOD PLAN STARTS HERE</p>
          <h1>
            Find your next
            <br />
            <em>good evening.</em>
          </h1>
          <p className="lede">Thoughtful things to do, picked for your city.</p>
        </div>
        <div className="welcome-note">
          <span className="note-mark">✳</span>
          <span>
            Made for the
            <br />
            curious in Delhi
          </span>
        </div>
      </section>
      <section className="search-row">
        <label className="searchbox">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try music, workshops, film…"
            aria-label="Search events"
          />
          <kbd>⌘ K</kbd>
        </label>
        <label className="select-label">
          <span className="sr-only">Sort events</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Soonest</option>
            <option>Price: low to high</option>
            <option>Price: high to low</option>
          </select>
        </label>
      </section>
      <section className="browse">
        <div className="section-head">
          <div>
            <p className="eyebrow">THE CITY, THIS WEEK</p>
            <h2>Browse by mood</h2>
          </div>
          <span className="quiet">{visible.length} events</span>
        </div>
        <div className="chips">
          {["All events", "Music", "Art", "Workshop", "Film", "Food"].map(
            (item) => (
              <button
                className={category === item ? "chip on" : "chip"}
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </section>
      <section className="events-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2>Coming up in Delhi</h2>
          </div>
          <button
            className="text-link"
            onClick={() => {
              setCategory("All events");
              setQuery("");
            }}
          >
            See all events ↗
          </button>
        </div>
        {visible.length ? (
          <div className="event-grid">
            {visible.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <span>⌕</span>
            <h3>No events found</h3>
            <p>Try another search or choose a different category.</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setCategory("All events");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
