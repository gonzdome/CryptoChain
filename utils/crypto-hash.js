const crypto = require('crypto');

/**
 * Creates a hash.
 * @param {any} inputs - Any necessary data, ex: 'str1', 'str2', object {}...
 * @returns {string} - Hashed data.
 */
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    const data = inputs.map(input => JSON.stringify(input)).sort().join(' ');

    hash.update(data);

    return hash.digest('hex');
};

module.exports = cryptoHash;