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
    setTransaction (transaction) {
        this.transactionMap[transaction.id] = transaction;
    };
};

module.exports = TransactionPool;