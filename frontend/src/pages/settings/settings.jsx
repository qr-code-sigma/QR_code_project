import React, {useEffect, useState} from "react";
import "./settings.css";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../redux/reducers/user.js";

function Settings() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.auth);
    const { status, error } = useSelector(state => state.user);
    const [isDisabled, setIsDisabled] = useState(true);

    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        oldPassword: "",
        newPassword: ""
    })

    useEffect(() => {
        let isSatisfactory = false;

        if(!formData.oldPassword) {
            setIsDisabled(true)
            return;
        }
        debugger
        for (const [key, value] of Object.entries(formData)) {
            if (userData[key]) {
                if (userData[key] === formData[key]) {                      //If current data is equal to new data, then button should be disabled
                    setIsDisabled(true)
                    return;
                }
            }
            if (value.length > 0 && value.length < 5) {
                setIsDisabled(true)
                return;
            }
            if(value.length > 5 && key !== 'oldPassword') {
                isSatisfactory = true;
            }
        }

        if(isSatisfactory){
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [formData]);

    const onChangeInput = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="settings-dialog">
            <section className="settings-header">
                <h1>Edit profile</h1>
                <p>Make changes to your profile here. Click save when you're done.</p>
            </section>
            <section className="settings-content">
                <div className="settings-row">
                    <label htmlFor="username">Username</label>
                    <input onChange={onChangeInput} type="text" name="username"/>
                </div>
                <div className="settings-row">
                    <label htmlFor="username">Name</label>
                    <input onChange={onChangeInput} type="text" name="first_name"/>
                </div>
                <div className="settings-row">
                    <label htmlFor="email">Surname</label>
                    <input onChange={onChangeInput} type="email" name="last_name"/>
                </div>
                <div className="settings-row">
                    <label htmlFor="password">Old Password</label>
                    <input onChange={onChangeInput} type="password" name="oldPassword" placeholder=""
                           value={formData.oldPassword}/>
                </div>
                <div className="settings-row">
                    <label htmlFor="password">New Password</label>
                    <input onChange={onChangeInput} type="password" name="newPassword" placeholder=""
                           value={formData.newPassword}/>
                </div>
            </section>
            <section className="settings-actions">
                <button onClick={() => navigate(-1)} className="btn-default">
                    <span>Cancel</span>
                </button>
                <button onClick={() => dispatch(updateUser({user: formData, navigate}))} className="btn-primary" disabled={isDisabled}>
                    <span>Confirm</span>
                </button>
            </section>
            {status === 'loading' ? <>Loading...</> :
             error ? error : null}
        </div>
    );
}

export default Settings;
