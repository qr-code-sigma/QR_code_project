import React, { useState } from "react";
import "./event.css";

function Event({ status }) {
  const [registered, setRegistered] = useState(false);

  const handleRegister = () => {
    setRegistered(true);
  };

  const statusClass =
    status === "Public"
      ? "event-page-status public"
      : "event-page-status private";

  return (
    <div className="event-page-container">
      <header className="back-header">
        <button className="btn-default">
          <span>Back</span>
        </button>
      </header>
      <main className="event-main-container">
        <p className="event-page-title">Tech Conference</p>
        <div className="places-badge">82/100</div>
        <section className="event-main-content">
          <div className="event-page-description">
            <p>
              <b>Description: </b>Join us at the Tech Conference 2025, where
              leading experts will present groundbreaking tech innovations, and
              attendees can network with industry professionals. Explore
              workshops, panels, and demos showcasing the future of technology.
              Whether you're a startup founder or a tech enthusiast, this event
              offers valuable insights and opportunities.Join us at the Tech
              Conference 2025, where leading experts will present groundbreaking
              tech innovations, and attendees can network with industry
              professionals. Explore workshops, panels, and demos showcasing the
              future of technology. Whether you're a startup founder or a tech
              enthusiast, this event offers valuable insights and opportunities.
            </p>
          </div>
          <div className="event-page-info">
            <div className="event-page-date">
              <p>
                <b>Date: </b>22.05.2025, 18.00
              </p>
            </div>
            <div className="event-page-location">
              <p>
                <b>Location: </b>1234 Polyana Street, Apt 56 New York
              </p>
            </div>
            <div className={statusClass}>
              <p>
                <b>Status: </b>
                {status}
              </p>
            </div>
          </div>
        </section>
        {registered ? (
          <div className="registration-success">
            <h2>You’ve been registered!</h2>
            <p>Here is your QR code</p>
            <div className="qr-code-placeholder"></div>
            <button className="btn-download">Download PDF</button>
            <button className="btn-lg">
              <span>Main Page</span>
            </button>
          </div>
        ) : (
          <button className="btn-lg" onClick={handleRegister}>
            <span>Register</span>
          </button>
        )}
      </main>
    </div>
  );
}

export default Event;
