import { useState, useEffect } from "react";

function Account(props) {
    const userDetails = props.data;
    const getUser = props.onLoad;

    const [userId, setUserId] = useState(() => getUser());
    const [accGetErr, setAccGetErr] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [accountAdd, setAccountAdd] = useState(0);
    const [accountWdraw, setAccountWdraw] = useState(0);
    const [accPostErr, setAccPostErr] = useState('')


    async function fetchDetails() {
        if (userId.length > 0) {
        const accurl = `https://mongodb-production-3bca.up.railway.app/account/${userId}`;
        const headers = new Headers();
        headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
        let fetchData = {
            method: 'GET',
            headers: headers
        }
        const accresponse = await fetch(accurl, fetchData);
        const accdata = await accresponse.json();

        if (accdata.status === 404) {
            setAccGetErr(accdata.message)
        } else {
            setAccountData(accdata)
        }
    }
    }

   async function handleSubmit(action) {
        const url = `https://mongodb-production-3bca.up.railway.app/account/${userId}`;
        let info = {
            amount: null,
            action: null,
        }
        if (action === 'add') {
            info.amount = accountAdd;
            info.action = 'add';
        }
        if (action === 'withdraw') {
            info.amount = accountWdraw;
            info.action = 'withdraw';
        }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ` + JSON.parse(localStorage.getItem('jwt')));
        let fetchData = {
            method: 'PUT',
            body: JSON.stringify(info),
            headers: headers,
        }

        console.log(fetchData);

        const response = await fetch(url, fetchData);
        const data = await response.json();
        
        if (data.message) {
            setAccPostErr(data.message)
        } else {
                setAccPostErr('');
                setAccountData(data);
                setAccountAdd(0);
                setAccountWdraw(0);
        }
    }


    useEffect(() => {
        fetchDetails();
    }, []);

    return(
    <div className="accountpage">
        {accGetErr &&
        <div className="accnotfound">Account not found.</div>
        }
        {!accGetErr &&
        <div className="accconents">
        <div className="accounttitle">Welcome to your account {userDetails}</div>
        <div className="accountinfo">
        <div className="accountbalance">
            <div className="accountbalancetitle">Your current balance:</div>
            <div className="accountbalancevalue">${Number(accountData.balance).toFixed(2)}</div>
        </div>
        <div className="accountcreated">
            <div className="accountcreatedtitle">Account started on:</div>
            <div className="accountcreatedon">{accountData.createdAt_formatted}</div>
        </div>
        <div className="accountupdated">
            <div className="accountupdatedtitle">Last deposit/withdrawal on:</div>
            <div className="accountupdatedon">{accountData.updatedAt_formatted}</div>
        </div>
        </div>
        <div className="accountactions">
            <div className="accounterror">{accPostErr}</div>
            <div className="accountadd">
                <div className="accountaddtitle">Add to account:</div>
                <div className="accountaddwrap">
                    <span className="currencysymb">$</span>
                    <input type="number" min="1" max="5000" required placeholder="0.00" value={accountAdd} className="accountaddamount" onChange={(e) => setAccountAdd(e.target.value)}/>
                </div>
                <button className="accountaddbtn" onClick={() => handleSubmit('add')}>Add</button>
            </div>
            {accountData.balance > 0 &&
            <div className="accountwdraw">
                <div className="accountaddtitle">Withdraw from account:</div>
                <div className="accountwdrawwrap">
                    <span className="currencysymb">$</span>
                    <input type="number" min="1" max="5000" required placeholder="0.00" value={accountWdraw} className="accountwdrawamount" onChange={(e) => setAccountWdraw(e.target.value)}/>
                </div>
                <button type='button' className="accountwdrawbtn" onClick={() => handleSubmit('withdraw')}>Withdraw</button>
            </div>
            }   
        </div>
        </div>
    }   
    </div>
    )
}

export default Account;