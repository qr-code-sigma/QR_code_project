import React from "react";
import "./profileHeader.css";

function ProfileHeader() {
  return (
    <header className="profile-header">
      <div className="profile-header-container">
        <button className="btn-default">
          <span>Back</span>
        </button>
        <p className="profile-header-text">Name Surname</p>
        <button className="btn-danger">
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}

export default ProfileHeader;
