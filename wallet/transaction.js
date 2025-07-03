const uuid = require('uuid/v1');
const { verifySignature } = require('../utils/elliptic');
const { AMOUNT_EXCEEDS_BALANCE } = require('../utils/messages');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {

    /**
     * Transaction Wallet
     */
    constructor({ senderWallet, recipient, amount, outputMap, input }) { 
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
    };

    /**
     * Validates the transaction.
     * @param {any} transaction - The amount.
     * @returns {boolean} If the transaction is valid or not.
    */ 
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

    /**
     * Rewards the miner.
     * @param {object} minerWallet - The miner wallet.
    */ 
    static rewardTransaction({ minerWallet }) {
        return new this({ 
            input: REWARD_INPUT,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD, }
        });
    };

    /**
     * Creates the outputMap.
     * @param {object} senderWallet - The sender wallet.
     * @param {any} recipient - The recipient.
     * @param {int} amount - The amount.
     * @returns {object} The outputMap.
    */ 
    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    };

    /**
     * Creates the input.
     * @param {object} senderWallet - The sender wallet.
     * @param {object} outputMap - The output map.
     * @returns {object} The input.
    */ 
    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    };

    /**
     * Updates the transaction.
     * @param {object} senderWallet - The sender wallet.
     * @param {any} recipient - The recipient.
     * @param {int} amount - The amount.
    */ 
    update({ senderWallet, recipient, amount }) {
        if (amount > this.outputMap[senderWallet.publicKey]) throw new Error(AMOUNT_EXCEEDS_BALANCE);

        if (!this.outputMap[recipient]) this.outputMap[recipient] = amount
        else this.outputMap[recipient] = this.outputMap[recipient] + amount;

        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    };
};

module.exports = Transaction;