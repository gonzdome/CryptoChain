import React, { Component } from "react";

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
            <div>
                <div>
                    <h3>Welcome to the Blockchain!</h3>
                </div>


                <div>Address: {address}</div>
                <div>Balance: {balance}</div>
                <br />
                <div>(This is a demo, not a real wallet)</div>
            </div>
        );
    }
};

export default App;