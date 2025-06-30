const { syncChains } = require('./helpers/sync-chains');
const express = require('express');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const Blockchain = require('./blockchain/index');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/index');

const app = express();

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain });

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

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
};

PEER_PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PEER_PORT, () => {
    console.log(`listening at http://localhost:${PEER_PORT}`);

    if (PEER_PORT !== DEFAULT_PORT) {
        syncChains(ROOT_NODE_ADDRESS, blockchain);
    };
});