const cryptoHash = require('./crypto-hash');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

/**
 * Verifies the signature.
 * @param {any} publicKey - Generaly a string
 * @param {any} data - Any data
 * @param {object} signature - The signature.
 * @returns {boolean} - If the signature is valid or not.
 */
const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptoHash(data), signature);
}

module.exports = { ec, verifySignature }; 