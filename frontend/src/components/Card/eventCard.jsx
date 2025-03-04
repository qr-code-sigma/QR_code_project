import React from "react";
import "./eventCard.css";
import { useNavigate } from "react-router-dom";

function EventCard({
  title,
  description,
  location,
  date,
  status,
  max_people,
  current_people,
}) {
  const navigate = useNavigate();

  const cardClass =
    status === "Public" ? "event-card public" : "event-card private";
  const statusClass =
    status === "Public" ? "event-status public" : "event-status private";

  const toEventDetail = () => {
    navigate("/event", {
      state: {
        title,
        description,
        location,
        date,
        status,
        max_people,
        current_people,
      },
    });
  };

  return (
    <button className={cardClass} onClick={toEventDetail}>
      <h3 className="event-title">{title}</h3>
      <p className="event-description">{description}</p>
      <div className="event-info">
        <div className="event-details">
          <p className="event-location">{location}</p>
          <p className="event-date">{date}</p>
        </div>
        <div className={statusClass}>{status}</div>
      </div>
    </button>
  );
}

export default EventCard;
