import React from "react";
import "./events.css";
import EventCard from "../Card/eventCard.jsx";

function Events() {
  return (
      <section className="events-main-content">
        <EventCard status="Public" />
        <EventCard status="Private" />
        <EventCard status="Private" />
        <EventCard status="Public" />
        <EventCard status="Public" />
        <EventCard status="Private" />
        <EventCard status="Private" />
        <EventCard status="Public" />
        <EventCard status="Public" />
        <EventCard status="Private" />
      </section>
  );
}

export default Events;
