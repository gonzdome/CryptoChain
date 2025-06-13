const { STARTING_BALANCE } = require("../config");

class Wallet {
    /**
     * 
     */
    constructor() {
        /** @property {int} balance - Chain of blocks. */
        this.balance = STARTING_BALANCE;
        
    }
};

module.exports = Wallet;