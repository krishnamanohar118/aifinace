import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorState, Loading } from "../components/States";
import { formatDate } from "../utils/finance";

export default function NotificationsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");

      const response = await api.get("/notifications");

      setData(response.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load notifications.",
      );
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      // Reload notifications after marking as read
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update notification.",
      );
    }
  };

  if (!data) {
    if (error) {
      return <ErrorState message={error} />;
    }

    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`${data.unread} unread update${
          data.unread === 1 ? "" : "s"
        }`}
      />

      {!data.items || data.items.length === 0 ? (
        <EmptyState message="No notifications yet. Budget and insight updates will show up here." />
      ) : (
        <div className="stack">
          {data.items.map((notification) => (
            <article
              className={`card notification ${
                notification.read ? "" : "unread"
              }`}
              key={notification._id}
              onClick={() => {
                if (!notification.read) {
                  markAsRead(notification._id);
                }
              }}
              style={{
                cursor: notification.read ? "default" : "pointer",
              }}
            >
              <Bell size={19} />

              <div>
                <h2>{notification.title}</h2>

                <p>{notification.message}</p>

                <small>{formatDate(notification.createdAt)}</small>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
