const Block = require('../block');
const Blockchain = require('../blockchain');

describe('Blockchain', () => {
    const blockchain = new Blockchain();

    const genesisBlock = Block.genesis();
    
    blockchain.chain.push(genesisBlock);

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with genesis block', () => {
        expect(blockchain.chain[0]).toEqual(genesisBlock);
    });

    it('adds a new `block` to the chain', () => {
        const newData = 'foo bar';

        blockchain.addBlock({ data: newData });

        const chainLastData = blockchain.chain[blockchain.chain.length - 1].data;

        expect(chainLastData).toEqual(newData);
    });;
});