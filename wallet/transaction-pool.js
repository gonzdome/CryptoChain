const Transaction = require("./transaction");

class TransactionPool {
    /**
     * TransactionPool Class
     */
    constructor() {
        this.transactionMap = {};     
    };

    /**
     * Sets the transaction inside transactionMap.
     * @param {object} transaction - The transaction to set.
    */ 
    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    };

    /**
     * Sets the map with the transactionPool data.
     * @param {object} transactionPool - The transactionPool to set.
    */ 
    setMap(transactionPool) {
        this.transactionMap = transactionPool;
    };

    /**
     * Checks if transaction exists.
     * @param {string} inputAddress - The address of the transaction.
    */ 
    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === inputAddress);
    };

    /**
     * Returns all valid transactions in the pool.
     * @returns {Array} An array of valid transactions.
     */
    validTransactions() {
        return Object.values(this.transactionMap).filter(transaction => Transaction.validTransaction(transaction));
    };

    /**
     * Clears the transactionMap by setting it to an empty object.
    */
    clear() {
        this.transactionMap = {};
    }

    /**
     * Removes from the transaction pool any transactions that have already been included in the blockchain.
     * Iterates through each block in the chain (except the genesis block) and deletes transactions from the pool if their IDs are found in the block's data.
     * @param {Object} options - The options object.
     * @param {Array} options.chain - The blockchain array to check for existing transactions.
    */
    clearBlockchainTransactions({ chain }) { 
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]) delete this.transactionMap[transaction.id];
            };
        };
    };
};

module.exports = TransactionPool;