import React from "react";
import "./alert.css";

function Alert({ title, message, iconClass }) {
  return (
    <div className="alert-container">
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
