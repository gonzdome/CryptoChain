const { GENESIS_DATA } = require("./config");

class Block {
    /**
     * Class to create an Block Object of a BlockChain
     */
    constructor({ timestamp, lastHash, hash, data }) {
       this.timestamp = timestamp; 
       this.lastHash = lastHash; 
       this.hash = hash; 
       this.data = data; 
    }

    /**
     * Factory Method: Static function to create the genesis Block
     */
    static genesis() {
        return new this(GENESIS_DATA);
    }
}

module.exports = Block;