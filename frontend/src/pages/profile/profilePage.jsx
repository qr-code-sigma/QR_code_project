import React, { useEffect, useState } from "react";
import "./profilePage.css";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import Footer from "../../components/Footer/Footer.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Events from "../../components/Events/events.jsx";
import axiosInstance from "../../config/axiosConfig.js";
import getAndRemoveStorageItem from "../../utils/getAndRemoveStorageItem.js";
import Loading from "../../components/Loading/loading.jsx";
import flushSearchInput from "../../utils/flushSearchInput.js";

function ProfilePage() {
  const navigate = useNavigate();
  const { userData, isAuthenticated, getMeStatus } = useSelector(
    (state) => state.auth,
  );
  const [events, setEvents] = useState([]);
  const [amountOfPages, setAmountOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageURL, setNextPageURL] = useState(null);
  const [previousPageURL, setPreviousPageURL] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const getStatusClass = (status) => {
    switch (status) {
      case "guest":
        return "status-public";
      case "employee":
        return "status-employee";
      case "admin":
        return "status-admin";
      default:
        return "";
    }
  };

  useEffect(() => {
    localStorage.setItem("CURRENT_PAGE", "1");
    if (isAuthenticated) {
      const savedPage = localStorage.getItem("CURRENT_PAGE") || 1;
      const savedInput = localStorage.getItem("SEARCH_INPUT") || "";

      setPage(parseInt(savedPage));
      setSearchInput(savedInput);

      fetchEventsWithSearch(savedInput, savedPage);
    }
  }, [isAuthenticated]);

  const fetchEventsWithSearch = (term, pageNum) => {
    const url = term
      ? `users/user_event/${term}?page=${pageNum}`
      : `users/user_events?page=${pageNum}`;

    fetchEvents(url).then(() => {
      console.log("Events were fetched with search term:", term);
    });
  };

  const fetchEvents = async (url) => {
    setLoading(true);
    let response;
    try {
      response = await axiosInstance.get(url);
      const { count, next, previous, results } = response.data;
      setAmountOfPages(Math.ceil(count / 21) || 1);
      setEvents(results);
      setNextPageURL(next);
      setPreviousPageURL(previous);
    } catch (error) {
      console.log(error.response.data);
      setError(error);
      console.error(error);
    } finally {
      setLoading(false);
      const resumeScroll = getAndRemoveStorageItem("SCROLL_POSITION");
      if (resumeScroll) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(resumeScroll), behavior: "smooth" });
        }, 200);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    localStorage.setItem("SEARCH_INPUT", searchInput);
    fetchEventsWithSearch(searchInput, 1);
  };

  const searchOnChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handlePageChange = (url, futurePage) => {
    if (isAuthenticated) {
      localStorage.setItem("CURRENT_PAGE", futurePage);
      fetchEvents(url).then(() => {
        console.log("Events were fetched");
      });
      setPage(futurePage);
    }
  };

  if (getMeStatus === "loading" || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Loading />
      </div>
    );
  }

  if (getMeStatus === "resolved" || getMeStatus === "rejected") {
    return (
      <div className="profile-page-container">
        <ProfileHeader
          name={userData.first_name}
          surname={userData.last_name}
        />
        <main className="profile-main-content">
          <section className="profile-info">
            <div className="status">
              <b>Status:</b>
              <div className={`user-status ${getStatusClass(userData.status)}`}>
                {userData.status}
              </div>
            </div>
            <div className="username">
              <b>Username:</b> <span>{userData.username}</span>
            </div>
            <div className="email">
              <b>Email:</b> <span>{userData.email}</span>
            </div>
          </section>
          <section className="to-settings">
            <button
                onClick={() => navigate("/editProfile")}
              className="btn-settings"
            >
              <span>Settings</span>
            </button>
          </section>
          <section className="registered-events-search-container">
            <h2>Events you are registered for</h2>
            <form onSubmit={handleSearch} className="search-form">
              <input
                value={searchInput}
                onChange={searchOnChange}
                type="text"
                placeholder="Search"
                className="search-bar"
                required
              />
              <button type="submit" className="bnt-search">
                <i className="fas fa-search"></i>
              </button>
              <button
                type="button"
                className="btn-clear-filter-term"
                title="Delete Filter Term"
                onClick={flushSearchInput}
              >
                <i className="fas fa-times"></i>
              </button>
            </form>
          </section>
          <Events events={events} />
          {!error ? (
            <div className="pagination-container">
              <button
                className="pagination-button"
                hidden={!previousPageURL}
                onClick={() => handlePageChange(previousPageURL, page - 1)}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h3>
                Page {page} of {amountOfPages}
              </h3>
              <button
                className="pagination-button"
                hidden={!nextPageURL}
                onClick={() => handlePageChange(nextPageURL, page + 1)}
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ) : (
            error &&
            Object.entries(error).map(([key, value], index) => {
              return (
                <div key={index}>
                  Error in field {key}
                  <br />
                  {value}
                </div>
              );
            })
          )}
        </main>
        <Footer />
      </div>
    );
  }
}

export default ProfilePage;
