import useApp from "../state/useApp";
import Page from "../components/Page";
import Empty from "../components/Empty";
import EventCard from "../components/EventCard";

export default function WishlistPage() {
  const { events, wishlist, go } = useApp();
  const saved = events.filter((event) => wishlist.includes(event.id));
  return (
    <Page
      title="Your wishlist"
      eyebrow="KEEP GOOD PLANS CLOSE"
      description="Events you have saved for another day."
    >
      {saved.length ? (
        <div className="event-grid">
          {saved.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Empty
          title="Nothing saved just yet"
          body="Save an event and it will be waiting here."
          action="Explore events"
          onAction={() => go("/")}
        />
      )}
    </Page>
  );
}
