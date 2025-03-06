import React from "react";
import "./header.css";
import {useNavigate} from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const navigateInTime = () => {
        navigate('/profile')
    }

    return (
        <header className="header">
            <div className="header-container">
                <button onClick={navigateInTime} className="btn-primary">
                    <span>Profile</span>
                </button>
                <form action="" className="search-form">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-bar"
                        required
                    />
                    <button className="bnt-search">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div>
        </header>
    );
}

export default Header;
