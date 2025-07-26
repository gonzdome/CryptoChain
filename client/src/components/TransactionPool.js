import React, { Component } from "react";
import { Link } from "react-router-dom";
import Transaction from "./Transaction";

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${process.env.URL}${process.env.PORT}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(transactionPoolMap => this.setState({ transactionPoolMap }))
            .catch(error => {
                console.error("Error fetching transaction pool map:", error);
            });
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