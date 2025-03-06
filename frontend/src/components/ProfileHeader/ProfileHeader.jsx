import React from "react";
import "./profileHeader.css";
import { useNavigate } from "react-router-dom";

function ProfileHeader() {
  const navigate = useNavigate();
  return (
    <header className="profile-header">
      <div className="profile-header-container">
        <button onClick={() => navigate("/")} className="btn-default">
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
