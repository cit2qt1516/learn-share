var bignum = require('bignum');

function lcm(a, b) {
    return a.mul(b).div(a.gcd(b));
}

function L(a, n) {
    return a.sub(1).div(n);
}

function getGenerator(n, n2) {
    n2 = n2 || n.pow(2);
    var alpha = bignum.rand(n);
    var beta = bignum.rand(n);
    return alpha.mul(n).add(1).mul(beta.powm(n, n2)).mod(n2);
}

paillier = {
    _publicKey: function (bits, n, n2, g) {
        // bits
        this.bits = bits;
        // n
        this.n = n;
        // n2 (cached n^2)
        this.n2 = n2;
        this.g = g;
    },
    _privateKey: function (lambda, mu, p, q, publicKey) {
        this.lambda = lambda;
        this.mu = mu;
        this.p = p;
        this.q = q;
        this.publicKey = publicKey;
    },
    getPublicKey: function (bits, n, g, format) {
        this.bits = bits;
        switch (format) {
            case 'dec':
                this.n = bignum(n);
                this.g = bignum(g);
                break;
            case 'hex':
                this.n = bignum(n, 16);
                this.g = bignum(g, 16);
                break;
            case 'base64':
                this.n = bignum.fromBuffer(new Buffer(n, 'base64'));
                this.g = bignum.fromBuffer(new Buffer(g, 'base64'));
                break;
            case 'bignum':
                this.n = n;
                this.g = g;
                break;
            default: // Big-endian binary Buffer
                this.n = bignum.fromBuffer(n);
                this.g = bignum.fromBuffer(g);
        }
        return new paillier._publicKey(this.bits, this.n, this.g);
    },
    getPrivateKey: function (lambda, mu, p, q, publicKey, format) {
        switch (format) {
            case 'dec':
                this.lambda = bignum(lambda);
                this.mu = bignum(mu);
                this.p = bignum(p);
                this.q = bignum(q);
                break;
            case 'hex':
                this.lambda = bignum(lambda, 16);
                this.mu = bignum(mu, 16);
                this.p = bignum(p, 16);
                this.q = bignum(q, 16);
                break;
            case 'base64':
                this.lambda = bignum.fromBuffer(new Buffer(lambda, 'base64'));
                this.mu = bignum.fromBuffer(new Buffer(mu, 'base64'));
                this.p = bignum.fromBuffer(new Buffer(p, 'base64'));
                this.q = bignum.fromBuffer(new Buffer(q, 'base64'));
                break;
            case 'bignum':
                this.lambda = lambda;
                this.mu = mu;
                this.p = p;
                this.q = q;
                break;
            default: // Big-endian binary Buffer
                this.lambda = bignum.fromBuffer(lambda);
                this.mu = bignum.fromBuffer(mu);
                this.p = bignum.fromBuffer(p);
                this.q = bignum.fromBuffer(q);
        }
        this.publicKey = publicKey;
        return new paillier._privateKey(this.lambda, this.mu, this.p, this.q, this.publicKey);
    },
    generateKeys: function (bitlength, simplevariant) {
        var p, q, n, phi, n2, g, lambda, mu, keys = {};
        // if p and q are bitlength/2 long, n is then bitlength long
        this.bitlength = bitlength || 2048;
        console.log("Generating Paillier keys of", this.bitlength, "bits");
        p = bignum.prime(this.bitlength / 2);
        do {
            q = bignum.prime(this.bitlength / 2);
            n = p.mul(q);
            phi = p.sub(1).mul(q.sub(1));
        } while (q.cmp(p) === 0 || n.bitLength() != this.bitlength || n.gcd(phi) != 1);

        n2 = n.pow(2);

        if (simplevariant === true) {
            //If using p,q of equivalent length, a simpler variant of the key
            // generation steps would be to set
            // g=n+1, lambda=(p-1)(q-1), mu=lambda.invertm(n)
            g = n.add(1);
            lambda = phi;
            mu = lambda.invertm(n);
        } else {
            g = getGenerator(n, n2);
            lambda = lcm(p.sub(1), q.sub(1));
            mu = L(g.powm(lambda, n2), n).invertm(n);
        }

        keys.publicKey = new paillier._publicKey(this.bitlength, n, n.pow(2), g);
        keys.privateKey = new paillier._privateKey(lambda, mu, p, q, keys.publicKey);
        return keys;
    },
    generateMongoKeys: function (keys) {
        console.log("Generating Paillier keys to store in MongoDB");
        var mongoKeys = {};

        mongoKeys.publicKey = new paillier._publicKey(this.bitlength, keys.publicKey.n.toString(), keys.publicKey.n.pow(2).toString(), keys.publicKey.g.toString());
        mongoKeys.privateKey = new paillier._privateKey(keys.privateKey.lambda.toString(), keys.privateKey.mu.toString(), keys.privateKey.p.toString(), keys.privateKey.q.toString(), mongoKeys.publicKey);
        return mongoKeys;
    }
};


paillier._publicKey.prototype = {
    encrypt: function (m) {
        var r;
        do {
            r = bignum.rand(this.n);
        } while (r <= 1);
        return {
            c: this.g.powm(m, this.n2).mul(r.powm(this.n, this.n2)).mod(this.n2),
            r: r
        };
    },
    isCorrectDecryption: function (m, c, r) {
        console.log("m:", m);
        console.log("c:", c);
        console.log("r:", r);
        var c2 = this.g.powm(m, this.n2).mul(r.powm(this.n, this.n2)).mod(this.n2);
        console.log("c2:", c2);
        if (c2.cmp(c) === 0)
            return true;
        else return false;
    }
};

paillier._privateKey.prototype = {
    decrypt: function (c) {
        return L(c.powm(this.lambda, this.publicKey.n2), this.publicKey.n).mul(this.mu).mod(this.publicKey.n);
    },
    getEncryptionRandom: function (c) {
        var m = this.decrypt(c);
        console.log("m:", m.toString());
        console.log("c:", c.toString());
        // c = g^m r^n mod n^2
        // y = c/g^m mod n^2 = r^n mod n^2
        var gm = this.publicKey.g.powm(m, this.publicKey.n2);
        var y = c.mul(gm.invertm(this.publicKey.n2)).mod(this.publicKey.n2);
        console.log("y:", y.toString());
        // http://en.wikipedia.org/wiki/Euler%27s_totient_function
        // phi(n^2)=n*(p-1)*(q-1)
        var phin2 = this.publicKey.n.mul(this.p.sub(1).mul(this.q.sub(1)));
        console.log("phin2:", phin2.toString());
        console.log("n:", this.publicKey.n);
        var u = this.publicKey.n.invertm(phi);
        console.log("u:", u.toString());
        var r = y.powm(u, this.publicKey.n2);
        return r;
    }
};

module.exports = paillier;
