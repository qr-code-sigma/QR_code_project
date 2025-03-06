import React from "react";
import "./eventCard.css";
import { useNavigate } from "react-router-dom";
import truncate from "../../utils/truncateText.js";

function EventCard({
  name,
  description,
  location,
  date,
  status,
  places,
  current_people,
}) {
  const navigate = useNavigate();

  const cardClass =
    status === "Public" ? "event-card public" : "event-card private";
  const statusClass =
    status === "Public" ? "event-status public" : "event-status private";

  const toEventDetail = () => {
    localStorage.setItem("SCROLL_POSITION", window.scrollY.toString());
    navigate("/event", {
      state: {
        name,
        description,
        location,
        date,
        status,
        places,
        current_people,
      },
    });
  };

  return (
    <button className={cardClass} onClick={toEventDetail}>
      <h3 className="event-title">{name}</h3>
      <p className="event-description">{truncate(description, 50)}</p>
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
