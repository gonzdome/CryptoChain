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
     * Replaces the chain.
     * @param {array} chain - chain.
    */ 
    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer!');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid!');
            return;
        }

        console.log('replacing chaing with', chain)
        this.chain = chain;
    }

    /**
     * Validate the blockchain.
     * @param {array} chain - The chain of blocks.
    */
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        const chainLenght = chain.length;
        for (let i = 1; i < chainLenght; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const lastDifficulty = chain[i - 1].difficulty;
            
            const lastBlock = chain[i - 1];
            
            if (lastHash !== lastBlock.hash) return false;
            
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;
        }

        return true;
    }
}

module.exports = Blockchain;