import { useState, useEffect } from "react";
import { redirect, Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import ShowHidePassword from './ShowHidePassword';
import uniqid from 'uniqid';


function Signup(props) {
    const userDetails = props.data;
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors([]);
        const url = 'https://tradingapideploy-2cfabb06dbc1.herokuapp.com/signup';
        let data = {
            username: username,
            password: password,
            passwordConfirmation: confirmPassword
        }

        let fetchData = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8' 
            })
        }

        fetch(url, fetchData)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.errors) {
            let errors = data.errors;
            setErrors(errors);
            return;
            } else {
                navigate("/login");
            }
        }).catch((error) => alert(error))
    }

    return(
        <div className="signupcont">
             {userDetails.length > 0 && (
                <div>You are already logged in!</div>
            )}
            {userDetails.length === 0 && (
                <div className="signupformcont">
                    <div className="signuptitle">SIGNUP</div>
                    <form className="signupform">
                        <div className="usernamelabel"> Username: </div>
                            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username"></input>
                        <div className="passwordcont"> Password:
                            <ShowHidePassword name='password' value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="*******"/>
                        </div>
                        <div className="confirmpasswordcont">Confirm Password: 
                            <ShowHidePassword name='password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} placeholder="*******"/>
                        </div>
                        <button type="submit" className="signupbtn" onClick={handleSubmit}>SIGNUP</button>
                    </form>
                    {errors.length > 0 &&
                    <ul className="errorslist">
                        {errors.map(error => (
                            <li key={uniqid()} className="signerror">
                                {error.msg}
                            </li>
                        ))}
                    </ul>
                    }
                </div>
            )}
        </div>
    )
}

export default Signup;