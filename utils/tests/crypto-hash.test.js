const cryptoHash = require('../crypto-hash');

describe('cryptoHash', () => {
    describe('generates a SHA-256 hashed output', () => {
        it('returns the Hashed data', () => {
            expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
        });

        it('produces the same hash with the same input arguments in any order', () => {
            expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'three', 'one'));
        });

        it('produces an unique hash when the properties have changed on an input', () => {
            const foo = {};
            const originalHash = cryptoHash(foo);

            foo['test'] = 'test';

            expect(cryptoHash(foo)).not.toEqual(cryptoHash(originalHash));
        });
    })
});