import React from "react";
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import {useState, useEffect } from 'react';
import { useNavigate  } from "react-router-dom";

function Navbar(props) {
    const [userInfo, setUserInfo] = useState(localStorage.getItem('jwt') || false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState(false);
    const onLo = props.onLogOut;
    const onSearch = props.onSearch;
    let navigate = useNavigate();


    const handleLogOut = () => {
        onLo();
        setUserInfo(false);
    };

    const gotoStock = () => {
        let symbfmt = searchInput.toUpperCase();
        let path = `/stock/${symbfmt}`;
        navigate(path);
        setSearchResult(false);
        setSearchInput('');
        window.location.reload(); 
    }

    const jwtGet = () => {
        let jwt = localStorage.getItem('jwt');
        if (jwt) {
            setUserInfo(jwt)
        }
        else {
            setUserInfo(false)
        }
    }

    async function fetchSymbols(symbol) {
        const url = `https://tradingapideploy-2cfabb06dbc1.herokuapp.com/stocks/${symbol}/info`;
        const headers = new Headers();
        headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
        let fetchData = {
            method: 'GET',
            headers: headers
        }
        const response = await fetch(url, fetchData);
        const data = await response.json();

        if (data.status === 404) {
            setSearchResult(false)
        } else {
            console.log(data)
            setSearchResult(data)
        }
    }

    useEffect(() => {
        jwtGet();
    });



    const navStyle = {
        color: '#000000'
    };


    return (
        <nav className="sitenav">
            <div className="titlecont">
                <Link style={navStyle} to= '/'>
                    <div className="titleinfo">
                    <img src={'/stocklogo.svg'} alt='' className="stockimg"/>
                    <div className="titletext">Mock Trade</div>
                    </div>
                </Link> 
            </div>
            <div className="sitelinks">
                {userInfo &&
                <Link style={navStyle} to= '/account'>
                    <div className="userlink">Account</div>
                </Link> 
                }
                 {userInfo &&
                <Link style={navStyle} to= '/portfolio'>
                    <div className="userlink">Portfolio</div>
                </Link> 
                }
                {userInfo &&
                <Link style={navStyle} to= '/activity'>
                <div className="userlink">Activity</div>
                </Link> 
                }
                {userInfo &&
                <div className="searchboxcont">
                    <input className= "searchboxinput" placeholder="Search a stock symbol (ex. AAPL)" value={searchInput} onChange={(e) => {setSearchInput(e.target.value); fetchSymbols(e.target.value)}}/>
                    <div className="searchresultcont">
                        {!searchResult && searchInput &&
                            <div className="noresult">No stocks found</div>
                        }
                        {searchResult && searchInput.length>0 &&
                        <div className="resultscont" onClick={gotoStock}>
                            <div className="resultsymbol">{searchResult.symbol}</div>
                            <div className="resultsinfo">{searchResult.name} | {searchResult.stock_exchange.name}, {searchResult.country}</div>
                        </div>
                        }
                    </div>
                </div>
                }
                {userInfo && 
                <Link style={navStyle} to='/login'>
                    <button className='logoutbtn' type="button" onClick={handleLogOut}>Logout</button>
                </Link> 
                }
                {!userInfo &&
                <Link style={navStyle} to='/login'>
                    <button className='loginbtn' type="button">Login</button>
                </Link>
                }
                {!userInfo && 
                <Link style={navStyle} to='/signup'>
                    <button className='signupbtn' type="button">Signup</button>
                </Link>
                }
            </div>
        </nav>
    )
}

export default Navbar