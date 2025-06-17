const { STARTING_BALANCE } = require("../config");
const { ec } = require("../utils/elliptic");
const cryptoHash = require("../utils/crypto-hash");


class  Wallet {
    /**
     * Wallet class
     */
    constructor() {
        /** @property {int} balance - Balance of the wallet. */
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();
        
        /** @property {any} publicKey - Public Key. */
        this.publicKey = this.keyPair.getPublic().encode('hex');
    };

    sign(data) {
        const hashedData = cryptoHash(data);
        return this.keyPair.sign(hashedData);
    };
};

module.exports = Wallet;