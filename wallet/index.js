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
     * @returns {any} The signature of the data.
    */ 
    sign(data) {
        const hashedData = cryptoHash(data);
        return this.keyPair.sign(hashedData);
    };

    /**
     * Creates the transaction.
     * @param {int} amount - The amount.
     * @param {any} recipient - The recipient.
     * @param {Array} chain - The blockchain array.
     * @returns {Transaction} The created transaction.
     * @throws {Error} If the amount exceeds the balance.
    */ 
    createTransaction({ amount, recipient, chain }) {
        if (chain) this.balance = Wallet.calculateBalance({ chain, address: this.publicKey });

        if (amount > this.balance) throw new Error(AMOUNT_EXCEEDS_BALANCE);

        return new Transaction({ senderWallet: this, recipient, amount });
    };

    /**
     * Calculates the balance for a given address by summing all outputs to that address
     * across the entire blockchain, starting from the second block (index 1).
     *
     * The balance is computed as:
     *   STARTING_BALANCE + sum of all outputs to the address in all transactions in all blocks (except genesis).
     *
     * @param {Object} param0 - The input object.
     * @param {Array} param0.chain - The blockchain array.
     * @param {string} param0.address - The public key address to calculate the balance for.
     * @returns {number} The calculated balance for the address.
     */
    static calculateBalance({ chain, address }) {
        let outputsTotal = 0;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            for (let transaction of block.data) {
                const addressOutput = transaction.outputMap[address];
                if (addressOutput) outputsTotal += addressOutput;
            }
        }

        return STARTING_BALANCE + outputsTotal;
    }
};

module.exports = Wallet;