import React from "react";
import "./QRCodePage.css";

function QRCodePage() {
  return (
    <section className="qr-page">
      <main className="main-qr">
        <h1>Name Surname</h1>
        <div>
          <p>
            Is registered for the <b>Tech Conference(change)</b>
          </p>
        </div>
        <div className="button-to-home">
          <button className="btn-lg">
            <span>Home</span>
          </button>
        </div>
      </main>
    </section>
  );
}

export default QRCodePage;
