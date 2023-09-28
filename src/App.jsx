import './App.css';
import React, {useState} from "react";
import jwt_decode from "jwt-decode";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Account from './components/Account';
import Portfolio from './components/Portfolio';
import Stock from './components/Stock';
import StockPage from './components/StockPage';

function App() {

  const [userDetails, setUserDetails] = useState([]);

  function CheckUserId () {
    let jtoken = localStorage.getItem('jwt')
    if (jtoken) {
      let jwtdecoded = jwt_decode(jtoken);
      console.log(jwtdecoded);
      let userid = jwtdecoded.user._id;
      return userid;
    } else {
      let userid = [];
      return userid
    }
  }

  function Loginset (username) {
    setUserDetails(username);
    return;
  }


  function LogOutset () {
    localStorage.removeItem('jwt');
    setUserDetails([]);
    return;
  }


  return (
    <HashRouter basename='/'>
        <div className='App'>
          <Navbar onLogOut={LogOutset}/>
          <Routes>
            <Route path="/" element={<Home data={userDetails} onLoad={CheckUserId}/>} />
            <Route path="/login" element={<Login data={userDetails} onLogIn={Loginset}/>} />
            <Route path="/signup" element={<Signup data={userDetails}/>} />
            <Route path="/account" element={<Account data={userDetails} onLoad={CheckUserId}/>} />
            <Route path="/activity" element={<Activity data={userDetails} onLoad={CheckUserId}/>} />
            <Route path="/portfolio" element={<Portfolio data={userDetails} onLoad={CheckUserId}/>} />
            <Route path="/stock" element={<Stock />}>
              <Route path=":stockid" element={<StockPage data={userDetails} onLoad={CheckUserId} onCommUpd={postset}/>}/>
            </Route>
          </Routes>
        </div>
      </HashRouter>
  )
}

export default App
