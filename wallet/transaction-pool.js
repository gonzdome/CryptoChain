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
     * Returns the valid transactions.
    */ 
    validTransactions() {
        return Object.values(this.transactionMap).filter(transaction => Transaction.validTransaction(transaction));
    };
};

module.exports = TransactionPool;