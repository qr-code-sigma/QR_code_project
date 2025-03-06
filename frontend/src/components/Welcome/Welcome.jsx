import React from "react";
import "./welcome.css";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  const navigateToRegistration = () => {
    navigate("/registration");
  };

  const navigateToAuthorization = () => {
    navigate("/authorization");
  };

  return (
    <main className="main-welcome-page">
      <h1>Welcome</h1>
      <div>
        <p>
          Create an account to register for events and generate your
          personalized QR code. Already have an account?
        </p>
        <p>
          <b> Sign in</b> to access your bookings.
        </p>
      </div>
      <div className="button-container">
        <button onClick={navigateToRegistration} className="btn-default">
          <span>Sign Up</span>
        </button>
        <button onClick={navigateToAuthorization} className="btn-primary">
          <span>Sign In</span>
        </button>
      </div>
    </main>
  );
}

export default Welcome;
