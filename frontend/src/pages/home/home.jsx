import Welcome from "../../components/Welcome/Welcome";
import Footer from "../../components/Footer/Footer";
import "./home.css";
import Header from "../../components/Header/header.jsx";
import Events from "../../components/Events/events.jsx";
import { useSelector } from "react-redux";
// import events from "../../test/AllEvents.js";
import axiosInstance from "../../config/axiosConfig.js";
import { useEffect, useState } from "react";

function Home() {
  const { userData, isAuthenticated } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`events?page=${pageNum}`);
      const { count, results } = response.data;

      if (pageNum === 1) setEvents(results);
      else {
        setEvents((prev) => [...prev, ...results]);
      }

      setHasMore(results.length === 50);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents(1);
      // (async () => {
      //   try {
      //     await fetchEvents(1);
      //   } catch (error) {
      //     console.error(error);
      //   }
      // })();
    }
  }, [isAuthenticated]);

  const handleMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage);
  };

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <>
          <Header />
          <div className="events-container">
            {userData.status === "admin" && <button>Add new</button>}
            <Events events={events} />
            {hasMore && (
              <button onClick={handleMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
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
