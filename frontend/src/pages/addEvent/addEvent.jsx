import React from "react";
import "./addEvent.css";

function AddEvent() {
  return (
    <div className="add-event-page-container">
      <header className="add-event-header">
        <h1>Add Event</h1>
      </header>
      <main className="add-event-main-container">
        <input
          type="text"
          className="add-event-title-input"
          placeholder="Event Title"
        />
        <input
          type="number"
          className="add-event-places-input"
          placeholder="Max number of visitors. "
        />
        <section className="add-event-main-content">
          <textarea
            className="add-event-description-input"
            placeholder="Description"
          />
          <div className="add-event-page-info">
            <input type="datetime-local" className="add-event-date-input" />
            <input
              type="text"
              className="add-event-location-input"
              placeholder="Location"
            />
            <select className="add-event-status-select">
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </section>
        <div className="add-event-buttons">
          <button className="btn-default">
            <span>Cancel</span>
          </button>
          <button className="btn-primary">
            <span>Add</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default AddEvent;
