const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.get('/api/blocks', (request, response) => {
    response.json(blockchain.chain);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`listening at localhost: ${PORT}`)
});