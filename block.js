const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
    /**
     * Creates a new Block.
     * @param {number} timestamp - The time when the block was created.
     * @param {string} lastHash - The hash of the previous block.
     * @param {string} hash - The hash of this block.
     * @param {any} data - The data stored in the block.
     * @param {int} nonce - The unique number randomly generated.
     * @param {int} difficulty - The difficulty of the nonce.
    */
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
       this.timestamp = timestamp; 
       this.lastHash = lastHash; 
       this.hash = hash; 
       this.data = data; 
       this.nonce = nonce; 
       this.difficulty = difficulty; 
    };

    /**
     * Factory method: Creates and returns the genesis block.
     * @returns {Block} The genesis block.
    */
    static genesis() {
        return new this(GENESIS_DATA);
    };

    /**
     * Factory Method: Static function to mine a new block
     * @param {Block} lastBlock - The last block in the chain.
     * @param {any} data - The data to store in the new block.
     * @returns {Block} The newly mined block.
    */
    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        let nonce = 0;
        let { difficulty } = lastBlock;
        
        const lastHash = lastBlock.hash;

        do { 
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) 
        
        return new this({ timestamp, lastHash, data, hash, nonce, difficulty });
    }

    /**
     * Factory Method: Static function to dinamically change the difficulty
     * @param {Block} originalBlock - The original block.
     * @param {any} timestamp - The timestamp to store in the new block.
     * @returns {Block} The new difficulty.
    */
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if (difficulty < 1) return 1;

        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}

module.exports = Block;