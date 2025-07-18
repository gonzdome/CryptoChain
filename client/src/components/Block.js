import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class Block extends Component {
    state = { displayTransaction: false };

    toggleTransactionDisplay = () => {
        this.setState({ displayTransaction: !this.state.displayTransaction });
    };

    get displayTransaction() {
        const { data } = this.props.block;

        const stringfiedData = data ? JSON.stringify(data) : 'No data available';
        const dataDisplay = stringfiedData.length > 35 ?
            `${stringfiedData.substring(0, 35)}...` : stringfiedData;

        return <div>
            Data: {this.state.displayTransaction ? JSON.stringify(data) : dataDisplay}
            <br />
            <Button
                bsStyle="danger"
                bbSize="small"
                onClick={this.toggleTransactionDisplay}
            >
                {this.state.displayTransaction ? 'Hide' : 'Show More'}
            </Button>
        </div>
    };

    render() {
        const { timestamp, hash } = this.props.block;

        const hashData = hash ? hash : 'No hash available';
        const hashDisplay = hashData.length > 15 ?
            `${hashData.substring(0, 15)}...` : hashData;

        return (
            <div className="Block">
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
                {this.displayTransaction}
            </div>
        );
    };
};

export default Block;