import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import { createUser } from '../../redux/reducers/user.js'
import useDisabledButton from "../../hooks/useDisabledButton.js";

function Registration() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(state => state.user)

    const [formData, setFormData] = React.useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const isDisabled = useDisabledButton(formData);

    const onSubmit = (e) => {
        e.preventDefault()

        dispatch(createUser({user: formData, navigate}))
    }

    const onChangeInput = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

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
                        name='userName'
                        value={formData.userName}
                        id="username"
                        onChange={onChangeInput}
                        placeholder="Username" />
                </div>
                <div className="settings-row">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name='firstName'
                        value={formData.firstName}
                        id="name"
                        onChange={onChangeInput}
                        placeholder="Name" />
                </div>
                <div className="settings-row">
                    <label htmlFor="surname">Surname</label>
                    <input
                        type="text"
                        name='lastName'
                        value={formData.lastName}
                        id="surname"
                        onChange={onChangeInput}
                        placeholder="Surname" />
                </div>
                <div className="settings-row">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name='email'
                        value={formData.email}
                        id="email"
                        onChange={onChangeInput}
                        placeholder="Email" />
                </div>
                <div className="settings-row">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name='password'
                        value={formData.password}
                        id="password"
                        onChange={onChangeInput}
                        placeholder="Password" />
                </div>
                <div className="settings-row">
                    <label htmlFor="password">Confirm password</label>
                    <input
                        type="password"
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        id="confirm-password"
                        onChange={onChangeInput}
                        placeholder="Confirm password"
                    />
                </div>
            </section>
            <section className="settings-actions">
                <button onClick={() => navigate('/')} className="btn-default">
                    <span>Cancel</span>
                </button>
                <button onClick={onSubmit} disabled={isDisabled} className="btn-primary">
                    <span>Submit</span>
                </button>
            </section>
            {status === 'loading' && 'loading'}
            {status === 'rejected' &&
            Object.values(error).map((error, index) => (
                <div key={index}>
                    {error}
                </div>
            ))
            }
        </div>
    );
}

export default Registration;