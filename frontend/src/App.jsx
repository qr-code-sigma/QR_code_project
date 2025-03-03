import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AddEvent, EventInfo, Home, Profile, QrCode, Settings} from './pages/index.js'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
import Registration from "./pages/registration/registration.jsx";
import ConfirmEmail from "./pages/confirmEmail/confirmEmail.jsx";

function App() {


  return (
        <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/qr-code" element={<QrCode />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/confirmEmail" element={<ConfirmEmail />} />

              <Route element={<ProtectedRoutes />}>
                  <Route
                      path="/profile"
                      element={<Profile status="Employee" />}
                  />

                  <Route path="/event" element={<EventInfo status="Private" />} />
                  <Route path="/addEvent" element={<AddEvent />} />
                  <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
        </Router>
  );
}

export default App;
