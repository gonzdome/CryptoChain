const uuid = require('uuid/v1');
const { verifySignature } = require('../utils/elliptic');

class Transaction {

    /**
     * Transaction Wallet
     */
    /**
     *
     */
    constructor({ senderWallet, recipient, amount }) { 
        this.id = uuid();
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    };

    static validTransaction(transaction) {
        const { input: { address, amount, signature }, outputMap } = transaction;

        const outputMapTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount);
        
        if (amount != outputMapTotal) {
            console.error(`Invalid transaction from ${address}`);
            return false;
        };

        const signatureIsValid = verifySignature({ publicKey: address, data:outputMap, signature });

        if (!signatureIsValid) {
            console.error(`Invalid signature from ${address}`);
            return false;
        };

        return true;
    };

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    };

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    };

    update({ senderWallet, recipient, amount }) {
        this.outputMap[recipient] = amount;
        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey]  - amount;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    };
};

module.exports = Transaction;