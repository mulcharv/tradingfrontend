import {useState, useEffect} from'react';
import uniqid from 'uniqid';
import { Link } from 'react-router-dom';


function Portfolio(props) {
    const userDetails = props.data;
    const getUser = props.onLoad;

    const [positions, setPositions] = useState([]);
    const [realizedTot, setRealizedTot] = useState('')
    const [userId, setUserId] = useState(() => getUser());
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [portfolioErr, setPortfolioErr] = useState(false);
    const [valueTotal, setValueTotal] = useState(0);
    const [currValue, setCurrValue] = useState(0);
    const [newPositions, setNewPositions] = useState(false);
    const [listCreate, setListCreate] = useState(false);

    async function fetchPortfolio() {
        let userinfo = getUser();
        setUserId(userinfo);

        if (userId.length > 0) {
            const ptfurl = `https://mongodb-production-3bca.up.railway.app/${userId}`;
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
                let positionupd= []
                for (const position of ptfdata.positions) {
                    ptftotal = ptftotal + position.value
                    let newposition = {};
                    const newpst = Object.assign(newposition, position)
                    let stockurl = `https://mongodb-production-3bca.up.railway.app/stocks/${position.ticker}/latestdata`;     
                    let stockresponse = await fetch(stockurl, fetchData);
                    let stockdata = await stockresponse.json();
                    newpst.currprice = stockdata.last;
                    newpst.currvalue = stockdata.last*position.quantity;
                    currtotal = currtotal + newpst.currvalue;
                    positionupd.push(newpst)
                }
                setValueTotal(ptftotal);
                setCurrValue(currtotal);
                setNewPositions(positionupd)
            }
    }
    }


    useEffect(() => {
        fetchPortfolio();
    }, []);

    useEffect(() => {}, [newPositions])

    console.log(newPositions)

    return(
    <div className='portfoliopage'>
        <div className='portfoliotitle'>Your Portfolio</div>
        {portfolioErr &&
        <div className='portfolioerr'>{portfolioErr}</div>
        }
        {!portfolioErr &&
        <div className='portfoliocont'>
            <div className='portfolioheader'>
                <div className='portfoliovalue'>Total Value: ${currValue.toFixed(2)}</div>
                <div className='realizedtot'>Realized Gain/Loss: ${Number(realizedTot).toFixed(2)}</div>
                <div className='unrealizedtot'>Unrealized Gain/Loss: ${(currValue-valueTotal).toFixed(2)}</div>
                <div className='portcreated'>Portfolio started on: {createdAt}</div>
                <div className='portupdated'>Last Activity in portfolio: {updatedAt}</div>
            </div>
            <div className='positionslistcont'>
            {newPositions &&
            <ul className='positionslist'>
                {newPositions.map(position => (
                    <li key={uniqid()} className='positioncont'>
                        <Link to={`/stock/${position.ticker}`}>
                        <div className='position'>
                            <div className='ptftickercont'>{position.ticker}</div>
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
                                <div className='currvalueamount'>${Number(position.currvalue).toFixed(2)}</div>
                            </div>
                            <div className='unrealizedtotcont'>
                                <div className='unrealizedtottext'>Unrealized gain/loss</div>
                                <div className='unrealizedtotamount'>${(position.currvalue-position.value).toFixed(2)}</div>
                            </div>
                            <div className='realizedtotcont'>
                                <div className='realizedtottext'>Realized gain/loss</div>
                                <div className='realizedtotamount'>${position.realized.toFixed(2)}</div>
                            </div>
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

export default Portfolio;