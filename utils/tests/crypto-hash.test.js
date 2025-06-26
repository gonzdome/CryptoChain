const cryptoHash = require('../crypto-hash');

describe('cryptoHash', () => {
    const hashFoo = '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae';

    describe('generates a SHA-256 hashed output', () => {
        it('returns the Hashed data', () => {
            expect(cryptoHash('foo')).toEqual(hashFoo);
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