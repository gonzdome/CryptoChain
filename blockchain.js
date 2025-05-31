const Block = require('./block');
const cryptoHash = require('./crypto-hash');

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

    /**
     * Validate the blockchain.
     * @param {array} chain - The chain of blocks.
    */
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        const chainLenght = chain.length;
        for (let i = 1; i < chainLenght; i++) {
            const { timestamp, lastHash, hash, data } = chain[i];

            const lastBlock = chain[i - 1];
            
            if (lastHash !== lastBlock.hash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data);

            if (hash !== validatedHash) return false;
        }

        return true;
    }
}

module.exports = Blockchain;