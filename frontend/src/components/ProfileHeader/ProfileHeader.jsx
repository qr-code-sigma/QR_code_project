import React from "react";
import "./profileHeader.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/reducers/auth.js";

function ProfileHeader({ name, surname }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function logOutMe() {
    dispatch(logOut({ navigate }));
  }

  const backButtonHandler = () => {
    localStorage.setItem("CURRENT_PAGE", "1");
    localStorage.setItem("SEARCH_INPUT", "");
    navigate("/");
  };

  return (
    <header className="profile-header">
      <div className="profile-header-container">
        <button onClick={backButtonHandler} className="btn-default">
          <span>Back</span>
        </button>
        <p className="profile-header-text">
          {name} {surname}
        </p>
        <button onClick={logOutMe} className="btn-danger">
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}

export default ProfileHeader;
