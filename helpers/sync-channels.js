const request = require('request');

const syncChannels = (ROOT_NODE_ADDRESS, blockchain, transactionPool) => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        };
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction map on a sync with', rootTransactionPoolMap);

            transactionPool.setMap(rootTransactionPoolMap);
        };
    });
};

module.exports = { syncChannels };