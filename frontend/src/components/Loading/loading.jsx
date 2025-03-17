import React from "react";
import "./loading.css";

function Loading({ customClass }) {
  return (
    <div className={`loader-container ${customClass || ""}`}>
      <div className="loader">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
      </div>
    </div>
  );
}

export default Loading;
