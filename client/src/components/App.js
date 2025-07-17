import React, { Component } from "react";
import Blocks from "./Blocks";
import logo from "../assets/logo.png";

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${process.env.URL}${process.env.PORT}/api/wallet-info`)
            .then(response => response.json())
            .then(walletInfo => this.setState({ walletInfo }));
    };


    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className="App">
                <img className='logo' src={logo}></img>
                <br />

                <div>
                    <h3>Welcome to the Blockchain!</h3>
                </div>


                <div className="WalletInfo">Wallet Information:
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>

                <br />
                <Blocks />
                <br />
                <div>(This is a demo, not a real wallet)</div>
            </div>
        );
    }
};

export default App;