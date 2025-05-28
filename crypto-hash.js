const crypto = require('crypto');

/**
 * Creates a hash.
 * @param {any} inputs - Any necessary data, ex: 'str1', 'str2', object {}...
 * @returns {string} - Hashed data.
 */
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    hash.update(inputs.sort().join(' '));

    return hash.digest('hex');
};

module.exports = cryptoHash;