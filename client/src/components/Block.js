import React, { Component } from 'react';

class Block extends Component {
    render() {
        const { timestamp, hash, data } = this.props.block;

        console.log(hash)
        const hashData = hash ? hash : 'No hash available';
        const hashDisplay = hashData.length > 15 ?
            `${hashData.substring(0, 15)}...` : hashData;

        const stringfiedData = data ? JSON.stringify(data) : 'No data available';
        const dataDisplay = stringfiedData.length > 35 ?
            `${stringfiedData.substring(0, 35)}...` : stringfiedData;

        return (
            <div className="Block">
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
                <div>Data: {dataDisplay}</div>
            </div>
        );
    };
};

export default Block;