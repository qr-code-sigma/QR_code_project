import React from "react";
import "./events.css";
import EventCard from "../Card/eventCard.jsx";

function Events({ events }) {
  return (
    <section className="events-main-content">
      {events.map((event) => {
        return <EventCard {...event} key={event.id} />;
      })}
    </section>
  );
}

export default Events;
