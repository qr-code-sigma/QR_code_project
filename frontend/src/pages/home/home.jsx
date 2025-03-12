import React from "react";
import Welcome from "../../components/Welcome/Welcome";
import Footer from "../../components/Footer/Footer";
import "./home.css";
import Header from "../../components/Header/header.jsx";
import Events from "../../components/Events/events.jsx";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig.js";
import { useEffect, useState } from "react";
import getAndRemoveStorageItem from "../../utils/getAndRemoveStorageItem.js";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/loading.jsx";

function Home() {
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
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const toAddPage = () => {
    navigate("/addEvent");
  };

  useEffect(() => {
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
      ? `/events/${term}/?page=${pageNum}`
      : `/events?page=${pageNum}`;

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
      setAmountOfPages(Math.ceil(count / 50) || 1);
      setEvents(results);
      setNextPageURL(next);
      setPreviousPageURL(previous);
    } catch (error) {
      console.log(response.data);
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
          width: "100%"
        }}
      >
        <Loading />
      </div>
    );
  }

  if (getMeStatus === "resolved" || getMeStatus === "rejected") {
    return (
      <div className="home-container">
        {isAuthenticated ? (
          <>
            <Header
              handleSearch={handleSearch}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
            <div className="events-container">
              {userData.status === "admin" && (
                <button onClick={toAddPage}>Add new</button>
              )}

              <Events events={events} />
            </div>

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
              <div>{error}</div>
            )}
          </>
        ) : (
          <div className="content">
            <Welcome />
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

export default Home;
