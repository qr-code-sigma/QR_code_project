import React, {useEffect, useState} from "react";
import {confirmEmail} from "../../redux/reducers/user.js";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";

function Registration() {
    const [code, setCode] = useState("");
    const [isDisabled, setIsDisabled] = React.useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(state => state.user)

    const location = useLocation();
    const email = location.state?.email || null;

    const onChangeInput = (e) => {
        setCode(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault()

        dispatch(confirmEmail({code, email, navigate}))
    }

    useEffect(() => {
        if(status === 'resolved') {
            navigate('/');
        }
    }, [status]);

    useEffect(() => {
        if(code.length === 6) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [code])

    return (
        <div className="settings-dialog">
            <section className="settings-header">
                <h1>Email confirmation</h1>
                <p>Confirm your email by entering verification code</p>
            </section>
            <section className="settings-content">
                <div className="settings-row">
                    <input
                        type="text"
                        name='confirmationCode'
                        value={code}
                        id="username"
                        onChange={onChangeInput}
                        placeholder="Enter code" />
                </div>
            </section>
            <section className="settings-actions">
                <button onClick={onSubmit} disabled={isDisabled} className="btn-primary">
                    <span>Submit</span>
                </button>
            </section>
            {status === 'loading' && 'loading'}
            {status === 'rejected' && error}
        </div>
    );
}

export default Registration;