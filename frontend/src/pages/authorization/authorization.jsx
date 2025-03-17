import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useDisabledButton from "../../hooks/useDisabledButton.js";
import { authMe, clearState } from "../../redux/reducers/auth.js";
import Loading from "../../components/Loading/loading.jsx";

function Authorization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authStatus, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = React.useState({
    userName: "",
    password: ""
  });

  const isDisabled = useDisabledButton(formData);

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(authMe({ userData: formData, navigate }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  const onChangeInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="settings-dialog">
      <section className="settings-header">
        <h1>Sign In</h1>
        <p>Login your account</p>
      </section>
      <section className="settings-content">
        <div className="settings-row">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            id="username"
            onChange={onChangeInput}
            placeholder="Username"
          />
        </div>
        <div className="settings-row">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            id="password"
            onChange={onChangeInput}
            placeholder="Password"
          />
        </div>
      </section>
      <section className="settings-actions">
        <button onClick={() => navigate("/")} className="btn-default">
          <span>Cancel</span>
        </button>
        <button
          onClick={onSubmit}
          disabled={isDisabled || authStatus === "loading"}
          className="btn-primary"
        >
          {authStatus === "loading" ? (
            <Loading customClass="scaled-loader" />
          ) : (
            <span>Submit</span>
          )}
        </button>
      </section>
      {authStatus === "rejected" && <div>{error}</div>}
    </div>
  );
}

export default Authorization;
