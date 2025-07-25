const redis = require('redis');
const CHANNELS = require('../utils/channels');

class PubSub {
    /**
     * PubSub redis pattern
     */
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    };

    /**
     * Function to handle message.
     * @param {string} channel - The desired channel.
     * @param {string} message - The message.
    */
    handleMessage(channel, message) {
        console.log(`Message received! Channel: ${channel}. Message: ${message}.`)

        const parsedMessage = JSON.parse(message);

        switch (channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clear({ chain: parsedMessage });
                });
                break;
            case CHANNELS.TRANSACTION:
                const existingTransaction = this.transactionPool.existingTransaction({ inputAddress: this.wallet.publicKey });
                if (!existingTransaction)
                    this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        };
    };

    /**
     * Function subscribe to channels.
    */
    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    };

    /**
     * Function to publish.
     * @param {string} channel - The desired channel.
     * @param {string} message - The message.
    */
    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    };

    /**
     * Function to broadcast a message to the chain channel.
    */
    broadcastChain() {
        this.publish({ channel: CHANNELS.BLOCKCHAIN, message: JSON.stringify(this.blockchain.chain) });
    };

    /**
     * Function to broadcast a message to the transaction channel.
    */
    broadcastTransaction(transaction) {
        this.publish({ channel: CHANNELS.TRANSACTION, message: JSON.stringify(transaction) });
    };
};

module.exports = PubSub;