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
}

module.exports = Block;