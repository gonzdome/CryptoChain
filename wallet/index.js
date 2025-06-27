const {  AMOUNT_EXCEEDS_BALANCE } = require('../utils/messages');
const { STARTING_BALANCE } = require("../config");
const { ec } = require("../utils/elliptic");
const cryptoHash = require("../utils/crypto-hash");
const Transaction = require('./transaction');


class  Wallet {
    /**
     * Wallet class
     */
    constructor() {
        /** @property {int} balance - Balance of the wallet. */
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();
        
        /** @property {any} publicKey - Public Key. */
        this.publicKey = this.keyPair.getPublic().encode('hex');
    };

    /**
     * Signs the hashed data to the Kei Pair.
     * @param {any} data - The data to sign.
    */ 
    sign(data) {
        const hashedData = cryptoHash(data);
        return this.keyPair.sign(hashedData);
    };

    /**
     * Creates the transaction.
     * @param {int} amount - The amount.
     * @param {any} recipient - The recipient.
    */ 
    createTransaction({ amount, recipient }) {
        if (amount > this.balance) throw new Error(AMOUNT_EXCEEDS_BALANCE);

        return new Transaction({ senderWallet: this, recipient, amount });
    };
};

module.exports = Wallet;