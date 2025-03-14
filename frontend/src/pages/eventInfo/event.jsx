import React, {useEffect, useState} from "react";
import axiosInstance from "../../config/axiosConfig.js";
import "./event.css";
import {useLocation, useNavigate} from "react-router-dom";
import Canvas from "../../components/Canvas/canvas.jsx";
import Loading from "../../components/Loading/loading.jsx";
import {useSelector} from "react-redux";

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

    const [errorDelete, setErrorDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const {userData} = useSelector(state => state.auth);

    const navigateToEditEvent = () => {
        navigate('/editEvent', {state: {id: location.state.id}})
    }

    useEffect(() => {
        setLoadingPage(true);
        const fetchQRCode = async () => {
            let response;
            try {
                response = await axiosInstance.get(
                    `/qr/get_qr_code/${location.state.id}`
                );
            } catch (e) {
                console.log(e.response.data.details);
                setLoadingPage(false);
                setErrorLoadingPage(e.response.data.details);
            } finally {
                console.log(response.data);
                setLoadingPage(false);
                setRegistered(response.data.isRegistered);
                if (response.data.isRegistered) {
                    setCode(response.data.code);
                }
            }
        };

        fetchQRCode().then(() => {
            console.log("Data was fetched");
        });
    }, []);

    async function registerForTheEvent() {
        let response;
        setIsLoadingRegister(true);
        try {
            response = await axiosInstance.post(
                `/users/${location.state.id}/register_for_event`
            );
        } catch (e) {
            console.log(e.response.data);
            setIsLoadingRegister(false);
            setErrorRegister(e.response.data.error);
        } finally {
            console.log(response?.data);
            setIsLoadingRegister(false);
            setRegistered(response?.data.isRegistered);
            if (response?.data.isRegistered) {
                setCode(response.data.code);
            }
        }
    }

    async function removeEvent() {
        const id = location.state.id;

        setLoadingDelete(true);

        try {
            await axiosInstance.delete(`/events/${id}`);

            setLoadingDelete(false);

            navigate('/');
        }catch(e) {
            setLoadingDelete(false);
            setErrorDelete(e.response.data?.error)
        }
    }

    const statusClass =
        location.state.status === "Public"
            ? "event-page-status public"
            : "event-page-status private";

    if(loadingDelete) {
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
        )
    }

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
                {userData.status === 'admin' &&
                    <div className="register-buttons-container">
                        <button onClick={removeEvent} className="btn-danger">
                            <span>Remove</span>
                        </button>
                        <button onClick={navigateToEditEvent} className="btn-default">
                            <span>Edit</span>
                        </button>
                    </div>}
                {loadingPage ? (
                    <Loading/>
                ) : errorLoadingPage ? (
                    <div>Error</div>
                ) : isLoadingRegister ? (
                    <Loading/>
                ) : errorRegister ? (
                    <h1>{errorRegister}</h1>
                ) : registered ? (
                    <div className="registration-success">
                        <h2>You’ve been registered!</h2>
                        <p>Here is your QR code</p>
                        <div className="qr-code-placeholder">
                            <Canvas matrix={code}/>
                        </div>
                        <button className="btn-download">Download PDF</button>
                    </div>
                ) : (
                    <div className="register-buttons-container">
                        <button className="btn-lg" onClick={registerForTheEvent}>
                            <span>Register</span>
                        </button>
                    </div>
                )}
                {errorDelete && errorDelete}
            </main>
        </div>
    );
}

export default Event;
