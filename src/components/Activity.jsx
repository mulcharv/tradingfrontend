import {useState, useEffect} from'react';

function Activity(props) {
    const userDetails = props.data;
    const getUser = props.onLoad;

    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState(() => getUser());
    const [activityErr, setActivityErr] = useState('');



    async function fetchActivity() {
        if (userId.length > 0) {
            const acturl = `https://mongodb-production-3bca.up.railway.app/activity/${userId}`;
            const headers = new Headers();
            headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
            let fetchData = {
                method: 'GET',
                headers: headers
            }
            const actresponse = await fetch(acturl, fetchData);
            const actdata = await actresponse.json();
    
            if (actdata.status === 404) {
                setActivityErr(actdata.message)
            } else {
                setTransactions(actdata.actions)
            }
    }
    }

    useEffect(() => {
        fetchActivity();
    }, []);

    return(
    <div className='activitypage'>
        <div className='activitytitle'>Activity</div>
            {transactions.length === 0 &&
                <div className="acitivtyerr">{activityErr}</div>
            }
            {transactions.length > 0 &&
                <div className='activitycont'>
                    <ul className='transactionslist'>
                        {transactions.map(transaction => (
                            <li key={transaction._id} className="transactioncont">
                                <div className='transaction'>
                                    <div className='transactiontext'>
                                        <div className='transactioninfo'>{transaction.action}</div>
                                        <div className='transactiondate'>{transaction.date}</div>
                                    </div>
                                    <div className='transactionamount'>$ {transaction.amount.toFixed(2)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            }
    </div>
    )


}

export default Activity;