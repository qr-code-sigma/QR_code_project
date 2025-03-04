import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import { createUser } from '../../redux/reducers/user.js'
import useDisabledButton from "../../hooks/useDisabledButton.js";

function Authorization() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(state => state.user)

    const [formData, setFormData] = React.useState({
        userName: '',
        password: '',
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
                <h1>Sign In</h1>
                <p>Login your account</p>
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
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name='password'
                        value={formData.password}
                        id="password"
                        onChange={onChangeInput}
                        placeholder="Password" />
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
            {status === 'rejected' && error}
        </div>
    );
}

export default Authorization;