import React, { useState } from "react";
import "./alert.css";

function Alert({ title, message, iconClass }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="alert-container">
      <button className="alert-close-btn" onClick={() => setIsVisible(false)}>
        &times;
      </button>
      <div className="alert-icon">
        <i className={iconClass}></i>
      </div>
      <div className="alert-content">
        <h4 className="alert-title">{title}</h4>
        <p className="alert-message">{message}</p>
      </div>
    </div>
  );
}

export default Alert;
