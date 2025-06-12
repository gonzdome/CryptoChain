const Blockchain = require('../blockchain/index');
const hexToBinary = require('hex-to-binary');

const blockChain = new Blockchain();

blockChain.addBlock({ data: 'initial' });

console.log('first block', blockChain.chain[blockChain.chain.length - 1]);

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

const blocksToCreate = 10000;

for (let i = 0; i < blocksToCreate; i++) {
    prevTimestamp = blockChain.chain[blockChain.chain.length - 1].timestamp;
    blockChain.addBlock({ data: `block ${i}` });
 
    nextBlock = blockChain.chain[blockChain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;

    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = (times.reduce((total, number) => (total + number))) / times.length;

    console.log(`
        Mining block time: ${timeDiff}ms / Average time: ${average}ms
        Difficulty: ${nextBlock.difficulty}.
        Hash: ${blockChain.chain[blockChain.chain.length - 1].hash}
        BinaryHash: ${hexToBinary(blockChain.chain[blockChain.chain.length - 1].hash)}
    `);
};