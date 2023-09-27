import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, Outlet } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {DateTime} from 'luxon';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

function StockPage(props) {
    const [stockInfo, setStockInfo] = useState(false);
    const [stockInfoError, setStockInfoError] = useState('');
    const [stockLatest, setStockLatest] = useState(false);
    const [stockLatestError, setStockLatestError] = useState('');
    const [stockInterval, setStockInterval] = useState(false);
    const [stockDifference, setStockDifference] = useState({amount: 0, percentage: 0});
    const [interval, setInterval] = useState(1);
    const [stockIntervalError, setStockIntervalError] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [watchlist, setWatchList] = useState(false);
    const [wlError, setWlError] = useState('');
    const [inWl, setInWl] = useState(false);
    const [inWlError, setInWlError] = useState('')
    const [userId, setUserId] = useState('');
    const [timeCapt, setTimeCapt] = useState('');
    const [position, setPosition] = useState(false);
    const [inPortfolioErr, setInPortfolioErr] = useState('');
    const [stockAction, setStockAction] = useState('');
    const [order, setOrder] = useState(false);
    const [orderErr, setOrderErr] = useState('')

    let params = useParams();
    let stockid = params.stockid;
    let navigate = useNavigate();
    const getUser = props.onLoad;
    const userDetails = props.data;
    const intervaldesc = {
        '1': 'day',
        '7': 'week',
        '30': 'month',
        '90': '3 months',
        '180': '6 months',
        '365': 'year'
    }

    const graphdata = {
        datasets: [{
            data: stockInterval,
            fill: true,
            backgroundColor: '#7ad3ff',
            borderColor: '#013365',
    
        }]
    }

    const graphoptions = {
        scales: {
            x: {
                ticks: {
                    display: false
                }
            }
        }
    }

    async function stockGetInfo() {
        let user = getUser();
        setUserId(user);
        
        if (userId.length > 0) {
            const wlurl = `https://tradingapi-production.up.railway.app/watchlist/${userId}`;
            const headers = new Headers();
            headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
            let fetchData = {
                method: 'GET',
                headers: headers
            }
            const wlresponse = await fetch(wlurl, fetchData);
            const wldata = await wlresponse.json();

            if (wldata.status === 404) {
                setWlError(wldata.message);
            } else {
                setWatchList(wldata.stocks);
                for (const ticker of watchlist) {
                    if (ticker === stockid) {
                        setInWl(true);
                    }
                }
            }
        }

        if (userDetails.length > 0) {
            const url = `https://tradingapi-production.up.railway.app/stock/${stockid}/info`;
            const headers = new Headers();
            headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
            let fetchData = {
                method: 'GET',
                headers: headers
            }
            const response = await fetch(url, fetchData);
            const data = await response.json();

            if (data.status === 404) {
                setStockInfoError(data.message)
            } else {
                setStockInfo(data)
            }

            const ptfurl = `https://tradingapi-production.up.railway.app/portfolio/${userId}`;
            const ptfresponse = await fetch(ptfurl, fetchData);
            const ptfdata = await ptfresponse.json();

            if (ptfdata.status === 404) {
                setInPortfolioErr(ptfdata.message);
            } else {
                let positions = ptfdata.positions;
                for (const position of positions) {
                    if (position.ticker === stockInfo.symbol) {
                        setPosition(position);                        
                    }
                }
            }
        }
    }

async function stockGetLatest() {
    if (userDetails.length > 0) {
        const url = `https://tradingapi-production.up.railway.app/stock/${stockid}/latestdata`;
        const headers = new Headers();
        headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
        let fetchData = {
            method: 'GET',
            headers: headers
        }
        const response = await fetch(url, fetchData);
        const data = await response.json();

        if (data.status === 404) {
            setStockLatestError(data.message)
        } else {
            setStockLatest(data);
            let date = new Date();
            let datehours = date.getHours();
            let datemin = date.getMinutes();
            let datesec = date.getSeconds();
            let ampm;
            if (datehours > 12) {
                datehrnew = datehours - 12;
                ampm = 'PM'
            } else {
                ampm = 'AM'
            }
            let datefmt = `${datehours}:${datemin}:${datesec} ${ampm}`
            setTimeCapt(datefmt);
        }
    }
}

async function stockGetInterval() {
    if (userDetails.length > 0) {
        const url = `https://tradingapi-production.up.railway.app/stock/${stockid}/${interval}`;
        const headers = new Headers();
        headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
        let fetchData = {
            method: 'GET',
            headers: headers
        }
        const response = await fetch(url, fetchData);
        const data = await response.json();

        if (data.status === 404) {
            setStockIntervalError(data.message)
        } else {
            let alldata = data.data;
            let dataflt = [];
            for (const entry of alldata) {
                let point = {
                    x: new Date(entry.date),
                    y: entry.last
                }
                dataflt.push(point)
            }
            setStockInterval(dataflt);
            let firstpoint = dataflt[dataflt.length-1];
            let lastpoint = dataflt[0];

            let stockdiffamt = lastpoint.y - firstpoint.y;
            let stockdiffptg = (stockdiffamt/firstpoint.y)*100
            setStockDifference({amount: stockdiffamt, percentage: stockdiffptg})

        }
    }
}

async function handleWatchlist(action) {
    const url = `https://tradingapi-production.up.railway.app/watchlist/${userId}/${stockid}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
    let info = {
        action: action
    }
    let fetchData = {
        method: 'POST',
        body: JSON.stringify(info),
        headers: headers
    }
    const response = await fetch(url, fetchData);
    const data = await response.json();

    if (data.status === 404) {
        setInWlErr(data.message)
    } else {
        setWatchList(data.stocks);
        if (action === 'add') {
            setInWl(true)
        } else {
            setInWl(false)
        }
    }
}

async function handleUpdate() {
    await stockGetLatest();
    await stockGetInterval();
}

const handleStockAction = (action) => {
    setStockAction(action);
}

const handleStockAmount = (sign) => {
    if (sign === 'plus') {
        setQuantity(quantity + 1)
    } else {
        let newquant = quantity - 1;
        if (newquant >= 0) {
            setQuantity(newquant)
        }
    }
}

async function handleStockOrder() {
    await stockGetLatest();
    setOrder(true);
}

async function handleStockFinal(decision) {
    if (decision === 'cancel') {
        setOrder(false)
    } else {
        const ordurl = `https://tradingapi-production.up.railway.app/stocks/${stockid}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
    let info = {
        action: stockAction,
        quantity: quantity,
        price: stockLatest.last,
        userid: userId,
    }
    let fetchData = {
        method: 'POST',
        body: JSON.stringify(info),
        headers: headers
    }
    const response = await fetch(ordurl, fetchData);
    const data = await response.json();
    
    if (data.status === 403) {
        setOrderErr(data.message);
    } else {
        let positions = data.positions;
                let tickarr = [];
                for (const position of positions) {
                    tickarr.push(position.ticker)                      
                    }
                
                if (tickarr.includes(stockInfo.symbol)) {
                    for (const position of positions) {
                        if (position.ticker === stockInfo.symbol) {
                            setPosition(position);                        
                        }
                    }
                } else {
                    setPosition(false);
                }

    }
    }
}


async function handleInterval(option) {
    setInterval(option);
    await stockGetLatest();
    await stockGetInterval();
}
    

    useEffect(() => {
        stockGetInfo();
        stockGetLatest();
        stockGetInterval();
    }, []);
    
    return (
        <div className="stockpage">
            {!stock && 
            <div className="stockmiss">Stock not found</div>
            }
            {stock &&
            <div className="stockcont">
                <div className="stockfirstsec">
                    <div className="stocktitle">{stockInfo.symbol} | {stockInfo.name}</div>
                    <div className="wishlisttoggle"></div>
                    {inWl &&
                    <button className="wltogbtn" onClick={handleWatchlist('remove')}>Remove from watchlist</button>
                    }
                    {!inWl &&
                    <button className="wltogbtn" onClick={handleWatchlist('add')}>Add to watchlist</button>
                    }
                </div>
                <div className="stocksecondsec">
                    <div className="stockpageleft">
                    <div className="graphtitle">Performance</div>
                    <div className="graphfirstsec">
                    <div className="graphfirstleft">
                    <div className="currentprice">$ {stockLatest.last} USD</div>
                    {stockDifference > 0 &&
                    <div className="stockdiffcont">
                    <div className="stockupsymb"><img src={'/up.svg'} alt='' className='infoimg'></img></div>
                    <div className="stockdiff">Up ${stockDifference.amount} {'('}{stockDifference.percentage}%{')'} past {intervaldesc[interval.toString()]}</div>
                    </div>
                    }
                    {stockDifference < 0 &&
                    <div className="stockdiffcont">
                    <div className="stockupsymb"><img src={'/down.svg'} alt='' className='infoimg'></img></div>
                    <div className="stockdiff">Down ${stockDifference.amount} {'('}{stockDifference.percentage}%{')'} past {intervaldesc[interval.toString()]}</div>
                    </div>
                    }
                    <div className="timecaptured">As of {timeCapt}</div>
                    </div>
                    <div className="graphfirstright">
                    <button type='button' onClick={handleUpdate}>Update Price</button>
                    </div>
                    </div>
                    <div className="graphcont">
                    <Line options={graphoptions} data={graphdata}/>
                    <div className="graphintervals">
                        <button type="button" className="intervalbtn" onClick={handleInterval(1)}>1D</button>
                        <button type="button" className="intervalbtn" onClick={handleInterval(7)}>1W</button>
                        <button type="button" className="intervalbtn" onClick={handleInterval(30)}>1M</button>
                        <button type="button" className="intervalbtn" onClick={handleInterval(90)}>3M</button>
                        <button type="button" className="intervalbtn" onClick={handleInterval(180)}>6M</button>
                        <button type="button" className="intervalbtn" onClick={handleInterval(365)}>1Y</button>
                    </div>
                    </div>
                    </div>
                    <div className="stockpageright">
                        <div className="stockactiontitle">Place an order</div>
                        <div className="stockactioncont">
                            <button type="button" className="buybtn" onClick={handleStockAction('buy')}>Buy</button>
                            {position &&
                            <button type="button" className="sellbtn" onClick={handleStockAction('sell')}>Sell</button>
                            }
                        </div>
                        <div className="quantitycont">
                            <div className="stockprompt">How many shares?</div>
                            <div className="quantity">{quantity}</div>
                            <div className="stocktoggle">
                                <button type='button' className="qntchgbtn" onClick={handleStockAmount('plus')}><img className="qntchgimg" src={'./pluscircle.svg'} alt=''></img></button>
                                <button type='button' className="qntchgbtn" onClick={handleStockAmount('minus')}><img className="qntchgimg" src={'./minuscircle.svg'} alt=''></img></button>
                            </div>
                        </div>
                        <div className="stockprice">{stockInfo.symbol} price: ${stockLatest.last} USD</div>
                        <div className="stocktotal">${(stockLatest.last)*(quantity)} USD</div>
                        {stockAction === 'buy' &&
                        <button type="button" className="stockorderbtn" onClick={handleStockOrder}>Buy {stockInfo.symbol}</button>
                        }
                        {stockAction === 'sell' &&
                        <button type="button" className="stockorderbtn" onClick={handleStockOrder}>Sell {stockInfo.symbol}</button>
                        }
                        {order &&
                        <div className="ordercont">
                            <div className="ordernumber">Number of shares: {quantity}</div>
                            <div className="orderprice">Updated price: {stockLatest.last}</div>
                            <div className="ordertotal">Total price: {quantity*stockLatest.last}</div>
                            <button className="orderconfirm" onClick={handleStockFinal('confirm')}>Confirm Order</button>
                            <button className="ordercancel" onClick={handleStockFinal('cancel')}>Cancel this order</button>
                        </div>
                        } 
                    </div>
                </div>
                {position &&
                <div className="stockthirdsec">
                    <div className="stockptftitle">Your Holdings</div>
                    <div className="holdinfocont">
                        <div className="holdquantcont">
                            <div className="holdquanttitle">Quantity</div>
                            <div className="holdquantity">{position.quantity}</div>
                        </div>
                        <div className="holdvaluecont">
                            <div className="holdvaluetitle">Total Value</div>
                            <div className="holdvalue">{position.quantity}*{stockLatest.last}</div>
                        </div>
                        <div className="holdperfcont">
                            <div className="holdperftitle">All time performance</div>
                            <div className="holdperformance">{(stockLatest.last*position.quantity)-(position.value)}</div>
                        </div>
                    </div>
                </div>
                }
            </div>
            }
        </div>
    )

}

export default StockPage;