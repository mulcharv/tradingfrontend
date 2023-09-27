import { useState, useEffect } from "react";

function Account(props) {
    const userDetails = props.data;
    const getUser = props.onLoad;

    const [userId, setUserId] = useState('');
    const [accGetErr, setAccGetErr] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [accountAdd, setAccountAdd] = useState(0);
    const [accountWdraw, setAccountWdraw] = useState(0);
    const [accPostErr, setAccPostErr] = useState('')


    async function fetchDetails() {
        let userinfo = getUser();
        setUserId(userinfo)
        if (userDetails.length > 0) {
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
            setAccGetErr(accdata.message)
        } else {
            setAccountData(accdata)
        }
    }
    }

   async function handleSubmit(action) {
        setAccPostErr('');
        const url = `https://blogapi-production-8080.up.railway.app/account/${userId}`;
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
            method: 'POST',
            body: JSON.stringify(info),
            headers: headers,
        }

        const response = await fetch(url, fetchData);
        const data = await response.json();
        
        if (data.message) {
            setAccPostErr(data.message)
        } else {
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
            <div className="accountbalancevalue">{accountData.balance}</div>
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
                    <input type="number" placeholder="0.00" value={accountAdd} className="accountaddamount" onChange={(e) => setAccountAdd(e.target.value)}/>
                </div>
                <button className="accountaddbtn" onClick={handleSubmit('add')}></button>
            </div>
            {accountData.balance > 0 &&
            <div className="accountwdraw">
                <div className="accountaddtitle">Withdraw from account:</div>
                <div className="accountwdrawwrap">
                    <span className="currencysymb">$</span>
                    <input type="number" placeholder="0.00" value={accountWdraw} className="accountwdrawamount" onChange={(e) => setAccountWdraw(e.target.value)}/>
                </div>
                <button type='button' className="accountwdrawbtn" onClick={handleSubmit('withdraw')}></button>
            </div>
            }   
        </div>
        </div>
    }   
    </div>
    )
}

export default Account;