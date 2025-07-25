const { AMOUNT_EXCEEDS_BALANCE } = require('../../utils/messages');
const { STARTING_BALANCE } = require('../../config');
const { verifySignature } = require('../../utils/elliptic');
const Wallet = require('../index');
const Transaction = require('../transaction');
const Blockchain = require('../../blockchain');

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('has a balance', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a publicKey', () => {
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('signing data', () => {
        const data = 'foo-bar';

        it('verifies a signature', () => {
            expect(
                verifySignature({ 
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data) 
                })
            ).toBe(true);
        });

        it('does not verify an invalid signature', () => {
            expect(
                verifySignature({ 
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data) 
                })
            ).toBe(false);
        });
    });

    describe('createTransaction()', () => {
        describe('and the amount exceeds the balance', () => {
            it('throws an error as the result', () => {
                expect(() => wallet.createTransaction({ amount: 999999, recipient: 'foo-recipient' }))
                .toThrow(AMOUNT_EXCEEDS_BALANCE);
            });
        });

        describe('and the amount is valid', () => {
            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 50;
                recipient = 'foo-recipient';
                transaction = wallet.createTransaction({ amount, recipient });
            });

            it('creates the instance of the `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction input with the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount of the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });

        describe('and a chain is passed', () => {
            it('calls Wallet.calculateBalance', () => {
                const calculateBalanceMock = jest.fn();

                const originalCalculateBalance = Wallet.calculateBalance;

                Wallet.calculateBalance = calculateBalanceMock;
                wallet.createTransaction({ recipient: 'foo-recipient', amount: 50, chain: new Blockchain().chain });
                expect(calculateBalanceMock).toHaveBeenCalled();

                Wallet.calculateBalance = originalCalculateBalance;
            });
        });
    });

    describe('calculateBalance()', () => {
        let blockchain;

        beforeEach(() => {
            blockchain = new Blockchain();
        });

        describe('and there are no outputs for the wallet', () => {
            it('returns the `STARTING_BALANCE`', () => {
                expect(
                    Wallet.calculateBalance({ chain: blockchain.chain, address: wallet.publicKey })
                )
                .toEqual(STARTING_BALANCE);
            });
        });

        describe('and there are outputs for the wallet', () => {
            let transactionOne, transactionTwo, nextTransaction;
            
            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({ amount: 50, recipient: wallet.publicKey });
                transactionTwo = new Wallet().createTransaction({ amount: 75, recipient: wallet.publicKey });
                nextTransaction = new Wallet().createTransaction({ amount: 100, recipient: 'another-address' });

                blockchain.addBlock({ data: [transactionOne, transactionTwo] });
            });

            it('adds the sum of all outputs to the wallet balance', () => {
                expect(
                    Wallet.calculateBalance({ chain: blockchain.chain, address: wallet.publicKey })
                )
                .toEqual(
                    STARTING_BALANCE +
                    transactionOne.outputMap[wallet.publicKey] +
                    transactionTwo.outputMap[wallet.publicKey]
                );
            });

            describe('and the wallet has made a transaction', () => {
                let recentTransaction;

                beforeEach(() => {
                    recentTransaction = wallet.createTransaction({ amount: 20, recipient: 'another-address' });
                    blockchain.addBlock({ data: [recentTransaction] });
                });

                it('returns the output amount for the wallet', () => {
                    expect(
                        Wallet.calculateBalance({ chain: blockchain.chain, address: wallet.publicKey })
                    )
                    .toEqual(recentTransaction.outputMap[wallet.publicKey]);
                });

                describe('and there are outputs next to and after the recent transaction', () => {
                    let sameBlockTransaction, nextBlockTransaction;

                    beforeEach(() => {
                        recentTransaction = wallet.createTransaction({ amount: 60, recipient: 'later-foo-address' });
                        sameBlockTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
                    
                        blockchain.addBlock({ data: [recentTransaction, sameBlockTransaction] });

                        nextBlockTransaction = new Wallet().createTransaction({ amount: 75, recipient: wallet.publicKey });

                        blockchain.addBlock({ data: [nextBlockTransaction] });
                    });

                    it('includes the output amounts in the returned balance', () => {
                        expect(
                            Wallet.calculateBalance({ chain: blockchain.chain, address: wallet.publicKey })
                        )
                        .toEqual(
                            recentTransaction.outputMap[wallet.publicKey] +
                            sameBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        );
                    });
                });
            });
        });
    });
});