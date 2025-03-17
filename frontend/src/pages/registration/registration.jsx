import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser, clearState } from "../../redux/reducers/user.js";
import useDisabledButton from "../../hooks/useDisabledButton.js";
import Loading from "../../components/Loading/loading.jsx";

function Registration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const [formData, setFormData] = React.useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const isDisabled = useDisabledButton(formData);

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createUser({ user: formData, navigate }));
  };

  const onChangeInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  return (
    <div className="settings-dialog">
      <section className="settings-header">
        <h1>Sign Up</h1>
        <p>Create an account.</p>
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            id="name"
            onChange={onChangeInput}
            placeholder="Name"
          />
        </div>
        <div className="settings-row">
          <label htmlFor="surname">Surname</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            id="surname"
            onChange={onChangeInput}
            placeholder="Surname"
          />
        </div>
        <div className="settings-row">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            id="email"
            onChange={onChangeInput}
            placeholder="Email"
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
        <div className="settings-row">
          <label htmlFor="password">Confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            id="confirm-password"
            onChange={onChangeInput}
            placeholder="Confirm password"
          />
        </div>
      </section>
      <section className="settings-actions">
        <button onClick={() => navigate("/")} className="btn-default">
          <span>Cancel</span>
        </button>
        <button
          onClick={onSubmit}
          disabled={isDisabled || status === "loading"}
          className="btn-primary"
        >
          {status === "loading" ? (
            <Loading customClass="scaled-loader" />
          ) : (
            <span>Submit</span>
          )}
        </button>
      </section>
      {status === "rejected" &&
        error &&
        (typeof error === "string"
          ? error
          : error && typeof error === "object"
          ? Object.values(error).map((errorMessage, index) => (
              <div key={index}>{errorMessage}</div>
            ))
          : null)}
    </div>
  );
}

export default Registration;
