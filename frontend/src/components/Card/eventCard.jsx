import React from "react";
import "./eventCard.css";

function EventCard({ status }) {
  const cardClass =
    status === "Public" ? "event-card public" : "event-card private";
  const statusClass =
    status === "Public" ? "event-status public" : "event-status private";

  return (
    <button className={cardClass}>
      <h3 className="event-title">Tech Conference</h3>
      <p className="event-description">
        A gathering of tech innovators and experts to share the latest industry
        trends.
      </p>
      <div className="event-info">
        <div className="event-details">
          <p className="event-location">Kyiv, Street 15</p>
          <p className="event-date">22.05.2025</p>
        </div>
        <div className={statusClass}>{status}</div>
      </div>
    </button>
  );
}

export default EventCard;
