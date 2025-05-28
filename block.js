const { GENESIS_DATA } = require("./config");

class Block {
    /**
     * Creates a new Block.
     * @param {number} timestamp - The time when the block was created.
     * @param {string} lastHash - The hash of the previous block.
     * @param {string} hash - The hash of this block.
     * @param {any} data - The data stored in the block.
    */
    constructor({ timestamp, lastHash, hash, data }) {
       this.timestamp = timestamp; 
       this.lastHash = lastHash; 
       this.hash = hash; 
       this.data = data; 
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
        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data
        });
    }
}

module.exports = Block;