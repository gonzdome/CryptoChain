const Wallet = require("..");
const TransactionMiner = require("../../app/transaction-miner");

module.exports = ({ wallet, blockchain, transactionPool, pubsub }) => {
    const walletFoo = new Wallet();
    const walletBar = new Wallet();

    const generateWalletTransaction = ({ wallet, recipient, amount }) => {
        const transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
        transactionPool.setTransaction(transaction);
        pubsub.broadcastTransaction(transaction);
    };

    const walletAction = () => generateWalletTransaction({
        wallet, recipient: walletFoo.publicKey, amount: 5
    });

    const walletFooAction = () => generateWalletTransaction({
        wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
    });

    const walletBarAction = () => generateWalletTransaction({
        wallet: walletBar, recipient: wallet.publicKey, amount: 15
    });

    for (let i = 0; i < 10; i++) {
        if (i % 3 === 0) {
            walletAction();
            walletFooAction();
        } else if (i % 3 === 1) {
            walletAction();
            walletBarAction();
        } else if (i % 3 === 2) {
            walletFooAction();
            walletBarAction();
        };

        const mineTransactions = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });
        mineTransactions.mineTransactions();
    };
};
