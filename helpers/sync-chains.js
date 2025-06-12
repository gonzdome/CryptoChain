const request = require('request');

const syncChains = (ROOT_NODE_ADDRESS, blockchain) => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        };
    });
};

module.exports = { syncChains };