const { syncChannels } = require('./helpers/sync-channels');
const express = require('express');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const Blockchain = require('./blockchain/index');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/index');
const TransactionMiner = require('./app/transaction-miner');

const app = express();

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    
    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

app.post('/api/transaction', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ recipient, amount });
        };
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message});
    };
    
    transactionPool.setTransaction(transaction);
    
    pubsub.broadcastTransaction(transaction);

    res.status(200).json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks');
});

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
};

PEER_PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PEER_PORT, () => {
    console.log(`listening at http://localhost:${PEER_PORT}`);

    if (PEER_PORT !== DEFAULT_PORT) {
        syncChannels(ROOT_NODE_ADDRESS, blockchain, transactionPool);
    };
});