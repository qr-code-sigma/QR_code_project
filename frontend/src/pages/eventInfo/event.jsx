import React, {useEffect, useState} from "react";
import axiosInstance from '../../config/axiosConfig.js'
import "./event.css";
import {useLocation, useNavigate} from "react-router-dom";

function Event() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = useState(null);

    const [registered, setRegistered] = useState(false);
    const [code, setCode] = useState(null);

    useEffect(() => {
        setLoading(true);
        const fetchQRCode = async () => {
            let response;
            try {
                response = await axiosInstance.get(`/qr/get_qr_code/${location.state.id}`)
            } catch (e) {
                console.log(response.data)
                setLoading(false);
                setError(response.data.details);
            } finally {
                console.log(response.data)
                setLoading(false);
                setRegistered(response.data.isRegistered)
                if(response.data.isRegistered) {
                    setCode(response.data.code);
                }
            }
        }

        fetchQRCode()
            .then(() => {
                console.log("Data was fetched");
            })
    }, [])

    const handleRegister = () => {
        setRegistered(true);
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
                <p className="event-page-title">{location.state.title}</p>
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
                {loading ? <div>Loading...</div> :
                error ? (
                    <div>Error</div>
                    ) :
                    registered ? (
                    <div className="registration-success">
                        <h2>You’ve been registered!</h2>
                        <p>Here is your QR code</p>
                        <div className="qr-code-placeholder"></div>
                        <button className="btn-download">Download PDF</button>
                        <button className="btn-lg">
                            <span>Main Page</span>
                        </button>
                    </div>
                ) : (
                    <button className="btn-lg" onClick={handleRegister}>
                        <span>Register</span>
                    </button>
                )}
            </main>
        </div>
    );
}

export default Event;
