import React, { Component } from "react";
import { Button, Form, FormControl, FormGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from "../history";

class ConductTransaction extends Component {
    state = { recipient: "", amount: 0 };

    updateRecipient = (event) => {
        this.setState({ recipient: event.target.value });
    };

    updateAmount = (event) => {
        this.setState({ amount: Number(event.target.value) });
    };

    conductTransaction = (event) => {
        event.preventDefault();
        const { recipient, amount } = this.state;

        fetch(`${process.env.URL}${process.env.PORT}/api/transaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipient, amount }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || data.type);
                history.push("/transaction-pool");
            })
            .catch(error => {
                console.error("Error conducting transaction:", error);
            });
    };

    render() {
        console.log(this.state);
        return (
            <div className="ConductTransaction">
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl
                        name="recipient"
                        input="text"
                        placeholder="Recipient Address"
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        name="amount"
                        input="number"
                        placeholder="0,00"
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    />
                </FormGroup>
                <Button
                    bsStyle="danger"
                    type="submit"
                    onClick={this.conductTransaction}
                >Send Transaction</Button>

                <br />
                <Link to="/">Back to Home</Link>
            </div>
        );
    };
};

export default ConductTransaction;