const { STARTING_BALANCE } = require("../config");
const { ec } = require("../utils/elliptic");

class  Wallet {
    /**
     * 
     */
    constructor() {
        /** @property {int} balance - Balance of the wallet. */
        this.balance = STARTING_BALANCE;

        const keyPair = ec.genKeyPair();
        
        /** @property {any} publicKey - Public Key. */
        this.publicKey = keyPair.getPublic().encode('hex');
    }
};

module.exports = Wallet;