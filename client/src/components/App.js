import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(walletInfo => this.setState({ walletInfo }));
    };


    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className="App">
                <img className="logo" src={logo}></img>
                <br />

                <div>
                    <h3>Welcome to the Blockchain!</h3>
                </div>
                <br />

                <div>
                    <Link to="/blocks">View Blockchain</Link>
                </div>
                <div>
                    <Link to="/transactions">New Transaction</Link>
                </div>
                <div>
                    <Link to="/transaction-pool">Transaction Pool</Link>
                </div>
                <br />

                <div className="WalletInfo">Wallet Information:
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
                <br />

                <div>(This is a demo, not a real wallet)</div>
            </div>
        );
    }
};

export default App;