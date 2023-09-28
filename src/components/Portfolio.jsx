import {useState, useEffect} from'react';

function Portfolio(props) {
    const userDetails = props.data;
    const getUser = props.onLoad;

    const [positions, setPositions] = useState([]);
    const [realizedTot, setRealizedTot] = useState('')
    const [userId, setUserId] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [portfolioErr, setPortfolioErr] = useState(false);
    const [valueTotal, setValueTotal] = useState(0);
    const [currValue, setCurrValue] = useState(0);
    const [newPositions, setNewPositions] = useState([]);

    async function fetchPortfolio() {
        let userinfo = getUser();
        setUserId(userinfo);

        if (userDetails.length > 0) {
            const ptfurl = `https://tradingapi-production.up.railway.app/portfolio/${userId}`;
            const headers = new Headers();
            headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
            let fetchData = {
                method: 'GET',
                headers: headers
            }
            const ptfresponse = await fetch(ptfurl, fetchData);
            const ptfdata = await ptfresponse.json();
    
            if (ptfdata.status === 404) {
                setPortfolioErr(ptfdata.message)
            } else {
                setPositions(ptfdata.positions);
                setRealizedTot(ptfdata.realizedTot);
                setCreatedAt(ptfdata.createdAt_formatted);
                setUpdatedAt(ptfdata.updatedAt_formatted);
                let ptftotal=0;
                let currtotal=0;
                let positionupd = [];
                for (const position of positions) {
                    ptftotal = ptftotal + position.value
                    let stockurl = `https://tradingapi-production.up.railway.app/stocks/${position.ticker}/latestdata`;
                    let stockresponse = await fetch(stockurl, fetchData);
                    let stockdata = await stockresponse.json();
                    position.currprice = stockdata.latest;
                    position.currvalue = stockdata.latest*position.quantity;
                    currtotal = currtotal + position.currvalue
                    positionupd.push(position)
                }
                setValueTotal(ptftotal);
                setCurrValue(currtotal);
                setNewPositions(positionupd);
            }
    }
    }


    useEffect(() => {
        fetchPortfolio();
    }, []);

    return(
    <div className='portfoliopage'>
        <div className='portfoliotitle'>Your Portfolio</div>
        {portfolioErr &&
        <div className='portfolioerr'>{portfolioErr}</div>
        }
        {!portfolioErr &&
        <div className='portfoliocont'>
            <div className='portfolioheader'>
                <div className='portfoliovalue'>Total Value: ${currValue}</div>
                <div className='realizedtot'>Realized Gain/Loss: ${realizedTot}</div>
                <div className='unrealizedtot'>Unrealized Gain/Loss: ${currValue-valueTotal}</div>
                <div className='portcreated'>Portfolio started on: {createdAt}</div>
                <div className='portupdated'>Last Activity in portfolio: {updatedAt}</div>
            </div>
        
            {positions.length > 0 &&
            <ul className='positionslist'>
                {newPositions.map(position => {
                    <li key={position._id} className='positioncont'>
                        <div className='position'>
                            <div className='currpricecont'>
                                <div className='currpricetext'>Today's Price</div>
                                <div className='currpriceamount'>${position.currprice}</div>
                            </div>
                            <div className='quantitycont'>
                                <div className='quantitytext'>Total shares</div>
                                <div className='quantityamount'>{position.quantity}</div>
                            </div>
                            <div className='currvaluecont'>
                                <div className='currvaluetext'>Today's total value</div>
                                <div className='currvalueamount'>${position.currvalue}</div>
                            </div>
                            <div className='unrealizedtotcont'>
                                <div className='unrealizedtottext'>Unrealized gain/loss</div>
                                <div className='unrealizedtotamount'>${position.currvalue-position.value}</div>
                            </div>
                            <div className='realizedtotcont'>
                                <div className='realizedtottext'>Realized gain/loss</div>
                                <div className='realizedtotamount'>${position.realizedTot}</div>
                            </div>
                        </div>
                    </li>
                })}
            </ul>
            }
        </div>
        }
    </div>
    )
}

export default Portfolio;