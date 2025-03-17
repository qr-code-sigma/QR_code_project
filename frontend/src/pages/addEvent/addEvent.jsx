import React, { useState } from "react";
import "./addEvent.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig.js";
import Loading from "../../components/Loading/loading.jsx";
import Alert from "../../components/Alert/alert.jsx";

function AddEvent() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newEventInfo, setNewEventInfo] = useState({
    name: "",
    places: "",
    description: "",
    date: "",
    location: "",
    status: "Public"
  });

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    newEventInfo.date = newEventInfo.date.slice(
      0,
      newEventInfo.date.indexOf("T")
    );

    try {
      await axiosInstance.post("events/", newEventInfo);
      localStorage.clear();
      navigate(-1);
    } catch (error) {
      console.log(
        "(catch from add)response after adding new event:",
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

  return (
    <div className="add-event-page-container">
      <header className="add-event-header">
        <h1>Add Event</h1>
      </header>
      <form onSubmit={handleAddFormSubmit} className="add-event-main-container">
        <input
          value={newEventInfo.name}
          onChange={onChangeAddForm}
          name="name"
          type="text"
          className="add-event-title-input"
          placeholder="Event Title"
          maxLength="100"
          required
        />
        <input
          value={newEventInfo.places}
          onChange={onChangeAddForm}
          name="places"
          type="number"
          className="add-event-places-input"
          placeholder="Max number of visitors. "
          required
        />
        <section className="add-event-main-content">
          <textarea
            value={newEventInfo.description}
            onChange={onChangeAddForm}
            name="description"
            className="add-event-description-input"
            placeholder="Description"
            maxLength="400"
            required
          />
          <div className="add-event-page-info">
            <input
              value={newEventInfo.date}
              onChange={onChangeAddForm}
              name="date"
              type="datetime-local"
              className="add-event-date-input"
              required
            />
            <input
              value={newEventInfo.location}
              onChange={onChangeAddForm}
              name="location"
              type="text"
              className="add-event-location-input"
              placeholder="Location"
              maxLength="100"
              required
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
          <button className="btn-default" onClick={() => navigate(-1)}>
            <span>Cancel</span>
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <Loading customClass="scaled-loader" />
            ) : (
              <span>Add</span>
            )}
          </button>
        </div>
      </form>
      {error &&
        Object.entries(error).map(([key, value], index) => (
          <Alert
            key={index}
            title={`Error in field ${key}`}
            message={value}
            iconClass="fas fa-exclamation-circle"
          />
        ))}
    </div>
  );
}

export default AddEvent;
