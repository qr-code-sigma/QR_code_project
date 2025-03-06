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

function Home() {
  const { userData, isAuthenticated } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [amountOfPages, setAmountOfPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nextPageURL, setNextPageURL] = useState(null);
  const [previousPageURL, setPreviousPageURL] = useState(null);

  const fetchEvents = async (url) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      const { count, next, previous, results } = response.data;

      setAmountOfPages(Math.ceil(count / 50));
      setEvents(results);
      setNextPageURL(next);
      setPreviousPageURL(previous);
    } catch (error) {
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

  useEffect(() => {
    if (isAuthenticated) {
      const savedPage = localStorage.getItem("CURRENT_PAGE") || 1;
      setPage(parseInt(savedPage));
      fetchEvents(
        `/events?page=${savedPage}`,
      );
    }
  }, [isAuthenticated]);

  const handlePageChange = (url, futurePage) => {
    if (isAuthenticated) {
      localStorage.setItem("CURRENT_PAGE", futurePage);
      fetchEvents(url);
      setPage(futurePage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <>
          <Header />
          <div className="events-container">
            {userData.status === "admin" && <button>Add new</button>}
            <Events events={events} />
          </div>

          {!loading ? (
            <>
              <button
                hidden={!previousPageURL}
                onClick={() => handlePageChange(previousPageURL, page - 1)}
              >
                Previous
              </button>
              <button
                hidden={!nextPageURL}
                onClick={() => handlePageChange(nextPageURL, page + 1)}
              >
                Next
              </button>
              <h3>
                Page {page} of {amountOfPages}
              </h3>
            </>
          ) : (
            "Loading...."
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

export default Home;
