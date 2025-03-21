import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AddEvent, EventInfo, Home, Profile, Settings} from './pages/index.js'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
import Registration from "./pages/registration/registration.jsx";
import ConfirmEmail from "./pages/confirmEmail/confirmEmail.jsx";
import {useDispatch} from "react-redux";
import { getMe } from "./redux/reducers/auth.js";
import Authorization from "./pages/authorization/authorization.jsx";
import EditEvent from "./pages/editEvent/editEvent.jsx";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMe());
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/authorization" element={<Authorization/>}/>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/confirmEmail" element={<ConfirmEmail/>}/>

                <Route element={<ProtectedRoutes/>}>
                    <Route
                        path="/profile"
                        element={<Profile status="Employee"/>}
                    />

                    <Route path="/editProfile" element={<Settings/>}/>
                    <Route path="/editEvent" element={<EditEvent />}/>
                    <Route path="/event" element={<EventInfo status="Private"/>}/>
                    <Route path="/addEvent" element={<AddEvent/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
