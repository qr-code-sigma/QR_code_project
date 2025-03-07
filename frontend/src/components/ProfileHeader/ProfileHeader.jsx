import React from "react";
import "./profileHeader.css";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import {logOut} from "../../redux/reducers/auth.js";

function ProfileHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function logOutMe () {
    dispatch(logOut({navigate}));
  }

  return (
    <header className="profile-header">
      <div className="profile-header-container">
        <button onClick={() => navigate("/")} className="btn-default">
          <span>Back</span>
        </button>
        <p className="profile-header-text">Name Surname</p>
        <button onClick={logOutMe} className="btn-danger">
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}

export default ProfileHeader;
