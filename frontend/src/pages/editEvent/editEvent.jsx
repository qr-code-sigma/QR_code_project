import React, { useEffect, useState } from "react";
import "../addEvent/addEvent.css";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig.js";
import Loading from "../../components/Loading/loading.jsx";

function EditEvent() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [newEventInfo, setNewEventInfo] = useState({
    name: "",
    places: "",
    description: "",
    date: "",
    location: "",
    status: "Public"
  });

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    newEventInfo.date = newEventInfo.date.slice(
      0,
      newEventInfo.date.indexOf("T")
    );

    try {
      const newData = {};
      Object.entries(newEventInfo).forEach(([key, value]) => {
        if (value) {
          newData[key] = value;
        }
      });
      const id = location.state.id;
      await axiosInstance.patch(`events/${id}`, newData);

      navigate("/");
    } catch (error) {
      console.log(
        "catch from patch response after editing event:",
        error.response
      );
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const onChangeAddForm = (e) => {
    setNewEventInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%"
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div className="add-event-page-container">
      <header className="add-event-header">
        <h1>Edit Event</h1>
      </header>
      <form
        onSubmit={handleEditFormSubmit}
        className="add-event-main-container"
      >
        <input
          value={newEventInfo.name}
          onChange={onChangeAddForm}
          name="name"
          type="text"
          className="add-event-title-input"
          placeholder="Event Title"
        />
        <input
          value={newEventInfo.places}
          onChange={onChangeAddForm}
          name="places"
          type="number"
          className="add-event-places-input"
          placeholder="Max number of visitors. "
        />
        <section className="add-event-main-content">
          <textarea
            value={newEventInfo.description}
            onChange={onChangeAddForm}
            name="description"
            className="add-event-description-input"
            placeholder="Description"
            maxLength="400"
          />
          <div className="add-event-page-info">
            <input
              value={newEventInfo.date}
              onChange={onChangeAddForm}
              name="date"
              type="datetime-local"
              className="add-event-date-input"
            />
            <input
              value={newEventInfo.location}
              onChange={onChangeAddForm}
              name="location"
              type="text"
              className="add-event-location-input"
              placeholder="Location"
              maxLength="100"
            />
            <select
              className="add-event-status-select"
              name="status"
              value={newEventInfo.status}
              onChange={onChangeAddForm}
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
        </section>
        <div className="add-event-buttons">
          <button
            type="button"
            className="btn-default"
            onClick={() => navigate(-1)}
          >
            <span>Cancel</span>
          </button>
          <button type="submit" className="btn-primary">
            <span>Submit</span>
          </button>
        </div>
      </form>
      {error &&
        Object.entries(error).map(([key, value], index) => {
          return (
            <div key={index}>
              Error in field {key}
              <br />
              {value}
            </div>
          );
        })}
    </div>
  );
}

export default EditEvent;
