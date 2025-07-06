const Transaction = require('../wallet/transaction');

class TransactionMiner {
    /**
     * Transaction Miner Class
     */
    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    /**
     * Mines all valid transactions from the transaction pool, adds them as a new block to the blockchain,
     * broadcasts the updated blockchain to the network, and clears the transaction pool.
     *
     * This method also includes a mining reward transaction for the miner's wallet.
     */
    mineTransactions() {
        const validTransactions = this.transactionPool.validTransactions();

        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        this.blockchain.addBlock({ data: validTransactions });

        this.pubsub.broadcastChain();

        this.transactionPool.clear();
    };
};

module.exports = TransactionMiner;