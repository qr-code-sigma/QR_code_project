import React from "react";
import Welcome from "../../components/Welcome/Welcome";
import Footer from "../../components/Footer/Footer";
import "./home.css";
import Header from "../../components/Header/header.jsx";
import Events from "../../components/Events/events.jsx";
import {useSelector} from "react-redux";

function Home() {

    const { userData, isAuthenticated } = useSelector((state) => state.auth);
    console.log(isAuthenticated)
    return (
        <div className="home-container">
            {isAuthenticated ?
                <>
                    <Header/>
                    <div className='events-container'>
                        {userData.status === 'admin' && <button>Add new</button>}
                        <Events />
                    </div>
                </> :
                <div className="content">
                    <Welcome />
                </div>
            }
            <Footer />
        </div>
    );
}

export default Home;
