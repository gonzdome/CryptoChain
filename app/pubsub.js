const redis = require('redis');
const CHANNELS = require('../utils/channels');

class PubSub {
    /**
     * PubSub redis pattern
     */
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient(); 

        this.subscribeToChannels();
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        this.subscriber.on('message', (channel, message)=> this.handleMessage(channel, message));
    };

    /**
     * Function to handle message.
     * @param {string} channel - The desired channel.
     * @param {string} message - The message.
    */
    handleMessage(channel, message) {
        console.log(`Message received! Channel: ${channel}. Message: ${message}.`)

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
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
     * Function to broadcast a message to the desired channel.
    */
    broadcastChain() {
        this.publish({ channel: CHANNELS.BLOCKCHAIN, message: JSON.stringify(this.blockchain.chain) });
    };
};

module.exports = PubSub;