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
     * Checks if transaction exists.
     * @param {string} inputAddress - The address of the transaction.
    */ 
    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === inputAddress);
    };
};

module.exports = TransactionPool;