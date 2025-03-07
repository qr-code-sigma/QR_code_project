import React, {useEffect, useState} from "react";
import axiosInstance from '../../config/axiosConfig.js'
import "./event.css";
import {useLocation, useNavigate} from "react-router-dom";
import Canvas from "../../components/Canvas/canvas.jsx";

function Event() {
    const location = useLocation();
    const navigate = useNavigate();

    //Using when loading page
    const [loadingPage, setLoadingPage] = React.useState(true);
    const [errorLoadingPage, setErrorLoadingPage] = useState(null);

    //Using when registering for the event
    const [isLoadingRegister, setIsLoadingRegister] = React.useState(false);
    const [errorRegister, setErrorRegister] = useState(null);

    const [registered, setRegistered] = useState(false);
    const [code, setCode] = useState(null);

    useEffect(() => {
        setLoadingPage(true);
        const fetchQRCode = async () => {
            let response;
            try {
                response = await axiosInstance.get(`/qr/get_qr_code/${location.state.id}`)
            } catch (e) {
                console.log(e.response.data.details)
                setLoadingPage(false);
                setErrorLoadingPage(e.response.data.details);
            } finally {
                console.log(response.data)
                setLoadingPage(false);
                setRegistered(response.data.isRegistered)
                if (response.data.isRegistered) {
                    setCode(response.data.code);
                }
            }
        }

        fetchQRCode()
            .then(() => {
                console.log("Data was fetched");
            })
    }, [])

    async function registerForTheEvent() {
        let response;
        setIsLoadingRegister(true)
        try {
            response = await axiosInstance.post(`/users/${location.state.id}/register_for_event`)
        } catch (e) {
            console.log(e.response.data)
            setIsLoadingRegister(false);
            setErrorRegister(e.response.data.error);
        } finally {
            console.log(response?.data)
            setIsLoadingRegister(false);
            setRegistered(response?.data.isRegistered)
            if (response?.data.isRegistered) {
                setCode(response.data.code);
            }
        }
    }

    const statusClass =
        location.state.status === "Public"
            ? "event-page-status public"
            : "event-page-status private";

    return (
        <div className="event-page-container">
            <header className="back-header">
                <button className="btn-default" onClick={() => navigate(-1)}>
                    <span>Back</span>
                </button>
            </header>
            <main className="event-main-container">
                <p className="event-page-title">{location.state.name}</p>
                <div className="places-badge">
                    {location.state.current_people}/{location.state.places}
                </div>
                <section className="event-main-content">
                    <div className="event-page-description">
                        <p>
                            <b>Description: </b> {location.state.description}
                        </p>
                    </div>
                    <div className="event-page-info">
                        <div className="event-page-date">
                            <p>
                                <b>Date: </b>
                                {location.state.date}
                            </p>
                        </div>
                        <div className="event-page-location">
                            <p>
                                <b>Location: </b> {location.state.location}
                            </p>
                        </div>
                        <div className={statusClass}>
                            <p>
                                <b>Status: </b>
                                {location.state.status}
                            </p>
                        </div>
                    </div>
                </section>
                {loadingPage ? <div>Loading...</div> :
                    errorLoadingPage ? (
                            <div>Error</div>
                        ) :
                        isLoadingRegister ? <h1>Loading...</h1> :
                            errorRegister ? <h1>{errorRegister}</h1> :
                                registered ? (
                                    <div className="registration-success">
                                        <h2>You’ve been registered!</h2>
                                        <p>Here is your QR code</p>
                                        <div className="qr-code-placeholder">
                                            <Canvas matrix={code}/>
                                        </div>
                                        <button className="btn-download">Download PDF</button>
                                    </div>
                                ) : (
                                    <button className="btn-lg" onClick={registerForTheEvent}>
                                        <span>Register</span>
                                    </button>
                                )}
            </main>
        </div>
    );
}

export default Event;
