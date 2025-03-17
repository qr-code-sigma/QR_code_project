import React from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import flushSearchInput from "../../utils/flushSearchInput.js";

function Header({ handleSearch, searchInput, setSearchInput }) {
  const navigate = useNavigate();

  const navigateInTime = () => {
    localStorage.setItem("SEARCH_INPUT", "");
    navigate("/profile");
  };

  const searchOnChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-container">
        <button onClick={navigateInTime} className="btn-primary btn-profile">
          <span>Profile</span>
        </button>
        <form onSubmit={handleSearch} className="search-form">
          <input
            value={searchInput}
            onChange={searchOnChange}
            type="text"
            placeholder="Search"
            className="search-bar"
            required
          />
          <button type="x" className="bnt-search" title="Search">
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
      </div>
    </header>
  );
}

export default Header;
