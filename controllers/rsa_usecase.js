/**
 * Created by juan on 14/12/15.
 */
var rsa = require('./rsa');
var bignum = require('bignum');

var keys = rsa.generateKeys(1024); // Change to at least 2048 bits in production state

console.log(keys);

var cleartext = "Hello, this is a cleartext message";

var m, c, d;

m = bignum.fromBuffer(new Buffer(cleartext));
console.log('\n\n\nCleartext:', m.toBuffer().toString(),'\n');

console.log('\n\nTesting RSA encryption/decryption\n');

c = keys.publicKey.encrypt(m);
console.log('encryption with public:', '\n', c.toBuffer().toString('base64'), '\n');
d = keys.privateKey.decrypt(c);
console.log('decryption with private:', '\n', d.toBuffer().toString(), '\n');

c = keys.privateKey.encrypt(m);
console.log('encryption with private:', '\n', c.toBuffer().toString('base64'), '\n');
d = keys.publicKey.decrypt(c);
console.log('decryption with public:', '\n', d.toBuffer().toString(), '\n');


console.log('\n\nTesting RSA blind encryption\n');
r = bignum.rand(keys.publicKey.n);
var blindMsg = m.mul(r.powm(keys.publicKey.e, keys.publicKey.n)).mod(keys.publicKey.n);
console.log('blind msg   m·r^e mod n:', '\n', blindMsg.toBuffer().toString('base64'), '\n');

var bc = keys.privateKey.encrypt(blindMsg);
console.log('(blind) encryption with private:', '\n', bc.toBuffer().toString('base64'), '\n');

c = bc.mul(r.invertm(keys.publicKey.n));
console.log('(unblinded) valid encryption    *1/r mod n:', '\n', c.toBuffer().toString('base64'), '\n');

d = keys.publicKey.decrypt(c);
console.log('decryption with public:', '\n', d.toBuffer().toString(), '\n');
