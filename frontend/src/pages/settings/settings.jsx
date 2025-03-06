import React from "react";
import "./settings.css";

function Settings() {
  return (
    <div className="settings-dialog">
      <section className="settings-header">
        <h1>Edit profile</h1>
        <p>Make changes to your profile here. Click save when you're done.</p>
      </section>
      <section className="settings-content">
        <div className="settings-row">
          <label htmlFor="username">Name</label>
          <input type="text" id="username" placeholder="Name" />
        </div>
        <div className="settings-row">
          <label htmlFor="email">Surname</label>
          <input type="email" id="email" placeholder="Surname" />
        </div>
        <div className="settings-row">
          <label htmlFor="password">Password</label>
          <div>
            <button className="btn-danger-low">
              <span>Change</span>
            </button>
          </div>
        </div>
      </section>
      <section className="settings-actions">
        <button className="btn-default">
          <span>Cancel</span>
        </button>
        <button className="btn-primary">
          <span>Cancel</span>
        </button>
      </section>
    </div>
  );
}

export default Settings;
