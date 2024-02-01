import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';


function Home(props) {
    const userDetails = props.data;
    const getUser = props.onLoad;

    const [userId, setUserId] = useState(() => getUser());
    const [accErrMess, setAccErrMess] = useState('');
    const [accountData, setAccountData] = useState([]);
    const [prtfErrMess, setPrtfErrMess] = useState('');
    const [portfolioData, setPortfolioData] = useState([]);
    const [wlErrMess, setWlErrMess] = useState('');
    const [watchlistData, setWatchlistData] = useState(false);



    async function fetchDetails() {
        let userinfo = getUser();
        console.log(userId);
        if (userId.length > 0) {
        const accurl = `https://tradingapi-production.up.railway.app/account/${userId}`;
        const headers = new Headers();
        headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
        let fetchData = {
            method: 'GET',
            headers: headers
        }
        const accresponse = await fetch(accurl, fetchData);
        const accdata = await accresponse.json();

        if (accdata.status === 404) {
            setAccErrMess(accdata.message)
        } else {
            setAccountData(accdata)
        }

        const prtfurl = `https://tradingapi-production.up.railway.app/portfolio/${userId}`;
        const prtfresponse = await fetch(prtfurl, fetchData);
        const prtfdata = await prtfresponse.json();

        if (prtfdata.status === 404) {
            setPrtfErrMess(prtfdata.message)
        } else {
            setPortfolioData(prtfdata)
        }

        const wlurl = `https://tradingapi-production.up.railway.app/watchlist/${userId}`;
        const wlresponse = await fetch(wlurl, fetchData);
        const wldata = await wlresponse.json();

        if (wldata.status === 404) {
            setWlErrMess(wldata.message)
        } else {
            let tickers = wldata.stocks;
            console.log(tickers);
            for (const ticker of tickers) {
                let url = `https://tradingapi-production.up.railway.app/stocks/${ticker}/latestdata`;
                const response = await fetch(url, fetchData);
                const data = await response.json();
                let index = tickers.indexOf(ticker);
                tickers[index] = {
                    symbol: ticker,
                    value: data.last
                };
            }
            setWatchlistData(tickers);
        }

           
    }
}

useEffect(() => {
    fetchDetails();
}, []);


return(
<div className="homepage">
    {userId.length === 0 &&
    <div className="homeblurb">
        <div className="hbtexts">
            <div className="promotext">The premier mock trading application for investors starting their journey.</div>
            <div className="promologincont">
                <div className="promologintext">Already a member?</div>
                <Link to="/login">
                        <div className="promologinlink">Login</div>
                </Link>
            </div>
            <div className="promosignupcont">
                <div className="promosignuptext">Not yet registered as a member?</div>
                <Link to="/signup">
                        <div className="signuplink">Signup</div>
                </Link>
            </div>
        </div>
        <div className="hbimage">
        <img src={'/wallstreet.jpeg'} alt='' className='hbimg'></img>
        </div>
    </div>
    }
    {userId.length > 0 && 
    <div className="homeinfo">
        <div className="homepagetitle">Welcome to your profile </div>
        <Link to="/account">
        <div className="accounthome">
            <div className="acchometitle">Your account balance:</div>
            <div className="acchomebalance">${Number(accountData.balance).toFixed(2)}</div>
            <div className="acchomeactivity">Last deposit/withdrawal: {accountData.updatedAt_formatted}</div>
            <div className="acchomestart">Account created on: {accountData.createdAt_formatted}</div>
        </div>
        </Link>
        <Link to="/portfolio">
        <div className="portfoliohome">
            <div className="prtfhometitle">Your portfolio value:</div>
            <div className="prtfhomereal">${Number(portfolioData.realizedTot).toFixed(2)}</div>
            <div className="prtfhomeactivity">Last buy/sell: {portfolioData.updatedAt_formatted}</div>
            <div className="prtfhomestart">Portfolio created on: {portfolioData.createdAt_formatted}</div>
        </div>
        </Link>
        <div className="watchlistcont">
            <div className="watchlisttitle">Stock Watchlist:</div>
            {watchlistData &&
                <ul className="watchlist">
                    {watchlistData.map(stock => (
                        <li key={uniqid()} className='wlitem'>
                            <Link to={`/stock/${stock.symbol}`}>
                            <div className="wlcont">
                                <div className="wlsymbol">{stock.symbol}</div>
                                <div className="wlvalue">${stock.value}</div>
                            </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            }
        </div>
    </div>
    }
</div>
)
}

export default Home;