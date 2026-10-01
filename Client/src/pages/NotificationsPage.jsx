import useApp from "../state/useApp";
import Page from "../components/Page";

export default function NotificationsPage() {
  const { notifications, setNotifications } = useApp();
  return (
    <Page
      title="Your inbox"
      eyebrow="NOTIFICATIONS"
      description="Sample updates live in this browser only."
    >
      <div className="notification-list">
        {notifications.length ? (
          notifications.map((item) => (
            <article
              className={`notification ${item.unread ? "unread" : ""}`}
              key={item.id}
            >
              <span className="notification-dot"></span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="quiet">Sample notification</span>
              </div>
              <button
                className="text-link"
                onClick={() =>
                  setNotifications((list) =>
                    list.map((notification) =>
                      notification.id === item.id
                        ? { ...notification, unread: false }
                        : notification,
                    ),
                  )
                }
              >
                {item.unread ? "Mark read" : "Read"}
              </button>
            </article>
          ))
        ) : (
          <p className="quiet">No sample notifications.</p>
        )}
      </div>
      {notifications.length > 0 && (
        <button
          className="button secondary"
          onClick={() =>
            setNotifications((list) =>
              list.map((item) => ({ ...item, unread: false })),
            )
          }
        >
          Mark all as read
        </button>
      )}
    </Page>
  );
}
