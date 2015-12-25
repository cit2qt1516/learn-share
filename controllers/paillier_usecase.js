/**
 * Created by juan on 14/12/15.
 */
var paillier = require('./paillier');
var bignum = require('bignum');

var keys = paillier.generateKeys(1024); // Change to at least 2048 bits in production state

console.log('modulus:',keys.publicKey.n.bitLength());
console.log(keys);

console.log('\n\nTesting additive homomorphism\n');

var m1 = 301;
var m2 = 29;

var c1 = keys.publicKey.encrypt(m1);
var c2 = keys.publicKey.encrypt(m2);

console.log('m1:', m1.toString());
console.log('c1:', c1.c.toString(), '\n');
console.log('r1:', c1.r.toString(), '\n');
console.log('m2:', m2.toString());
console.log('c2:', c2.c.toString(), '\n');
console.log('r2:', c2.r.toString(), '\n');


var encryptedSum = c1.c.mul(c2.c).mod(keys.publicKey.n2);
console.log("c1*c2:", encryptedSum.toString());

var sum = keys.privateKey.decrypt(encryptedSum);
console.log("Decryption of c1*c2:", sum.toString());
console.log("m1+m2=", m1+m2, "\n\n");

var r2 = c1.r.mul(c2.r);
console.log("r1*r2:", r2.toString());

//var encryptedSum2 = keys.publicKey.g.powm(sum, keys.publicKey.n2).mul(r.powm(keys.publicKey.n, keys.publicKey.n2)).mod(keys.publicKey.n2);
//console.log("Encrypted sum (from the cleartext sum and the published r):", encryptedSum2.toBuffer().toString('base64'));

console.log("Is correct decryption?", keys.publicKey.isCorrectDecryption(sum, encryptedSum, r2));