const Block = require('./block');
const cryptoHash = require('../utils/crypto-hash');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Blockchain {
    /**
     * Creates a new Blockchain.
     * @constructor
    */
    constructor() {
        /** @property {array} chain - Chain of blocks. */
        this.chain = [Block.genesis()];
    };

    /**
     * Creates a new block and add it to the blockchain.
     * @param {any} data - The data to create the new block.
    */
    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];

        const newBlock = Block.mineBlock({ lastBlock, data });

        this.chain.push(newBlock);
    };

    /**
     * Replaces the current chain with a new one if the new chain is longer and valid.
     * Optionally executes a callback.
     *
     * @param {array} chain - The new blockchain array to replace the current chain.
     * @param {boolean} validateTransactions - Whether to validate the transactions in the new chain.
     * @param {function} [onSuccess] - Optional callback to execute.
    */
    replaceChain(chain, validateTransactions, onSuccess) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer!');
            return;
        };

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid!');
            return;
        };

        if (validateTransactions && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid transaction data!');
            return;
        };

        if (onSuccess) onSuccess();

        console.log('replacing chaing with', chain)
        this.chain = chain;
    };

    /**
     * Validates the transaction data within each block of the blockchain.
     * Ensures that each block's transactions are valid according to the rules:
     * - Only one reward transaction per block.
     * - Each transaction is valid (signature, input amount, etc).
     * - No duplicate transactions.
     * 
     * @param {object} param0 - The object containing the chain to validate.
     * @param {array} param0.chain - The blockchain array to validate.
     * @returns {boolean} - Returns true if all transaction data is valid, otherwise false.
    */
    validTransactionData({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const transactionSet = new Set();

            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                const transactionAddress = transaction.input.address;

                if (transactionAddress === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceed limit');
                        return false;
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }

                    continue;
                }

                if (!Transaction.validTransaction(transaction)) {
                    console.error('Invalid transaction');
                    return false;
                };

                const trueBalance = Wallet.calculateBalance({ chain: this.chain, address: transactionAddress });

                if (transaction.input.amount !== trueBalance) {
                    console.error('Invalid input amount');
                    return false;
                };

                if (transactionSet.has(transaction.id)) {
                    console.error('Duplicate transaction');
                    return false;
                }

                transactionSet.add(transaction.id);
            };
        };

        return true;
    };

    /**
     * Validate the blockchain.
     * @param {array} chain - The chain of blocks.
     * @return {boolean} - Returns true if the chain is valid, otherwise false.
    */
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        const chainLenght = chain.length;
        for (let i = 1; i < chainLenght; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const lastDifficulty = chain[i - 1].difficulty;

            const lastBlock = chain[i - 1];

            if (lastHash !== lastBlock.hash) return false;

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;
        };

        return true;
    };
}

module.exports = Blockchain;