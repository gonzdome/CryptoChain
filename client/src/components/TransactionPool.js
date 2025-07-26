import React, { Component } from "react";
import { Link } from "react-router-dom";
import Transaction from "./Transaction";

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(transactionPoolMap => this.setState({ transactionPoolMap }))
    };

    componentDidMount() {
        this.fetchTransactionPoolMap();
        this.interval = setInterval(this.fetchTransactionPoolMap, 10000); // Fetch every 10 seconds
    }

    render() {
        return (
            <div className="TransactionPool">
                <div>
                    <Link to="/">Home</Link>
                </div>

                <h3>Transaction  Pool</h3>

                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
            </div>
        );
    };
};

export default TransactionPool;