import { useState, useEffect } from "react";
import { redirect, Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import ShowHidePassword from "./ShowHidePassword";


function Login(props) {
    const userDetails = props.data;
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoginError([]);
        const url = 'https://tradingapideploy-2cfabb06dbc1.herokuapp.com/login';
        let data = {
            username: username,
            password: password,
        }

        let fetchData = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'
            })
        }

        fetch(url, fetchData)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            if (data.status === 404) {
                let errarr = [];
                errarr.push(data.message);
                return setLoginError(errarr);
            } else {
                console.log(username)
                localStorage.setItem("jwt", JSON.stringify(data.token));
                props.onLogIn(username);
            }
        }
        )
        .catch((error) => {
            alert(error)
        })
    }

    return (
        <div className="logincont">
            {userDetails.length > 0 && (
                <div className='loggedin'>
                    <div className="loggedintext">You are now logged in!</div>
                    <Link to="/">
                    <div className="loggedinlink">Back to Home</div>
                    </Link>
                </div>
            )}
            {userDetails.length === 0 && (
                <div className="loginformcont">
                    <div className="logintitle">LOGIN</div>
                    <form className="loginform">
                        <div className="usernamelabel"> Username: </div>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username"></input>
                        <div className="passwordcont"> Password: </div>
                            <ShowHidePassword name='password' value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="*******"/>
                        <button type='submit' className="loginbtn" onClick={handleSubmit}>Login</button>
                    </form>
                    {loginError.length > 0 &&
                    <div className="errorcont">{loginError[0]}</div>
                    }
                    <div className="loginfooter">
                        <div className="loginfootertext">Don't have an account?</div>
                        <Link to="/signup">
                            <div className="loginfooterlink">Register Now!</div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login;