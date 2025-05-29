const Block = require('./block')

class Blockchain {
    /**
     * Creates a new Blockchain.
     * @constructor
    */ 
    constructor() {
        /** @property {array} chain - Chain of blocks. */
       this.chain = [Block.genesis()];  
    };

    /**
     * Creates a new block and add it to the blockchain.
     * @param {any} data - The data to create the new block.
    */ 
    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];

        const newBlock = Block.mineBlock({ lastBlock, data });

        this.chain.push(newBlock);
    }
}

module.exports = Blockchain;