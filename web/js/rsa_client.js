rsa = {
    publicKey: function (bits, n, e) {
        this.bits = bits;
        this.n = n;
        this.e = e;
    },
    privateKey: function (p, q, d, publicKey) {
        this.p = p;
        this.q = q;
        this.d = d;
        this.publicKey = publicKey;
    },
    generateKeys: function (bitlength) {
        var p, q, n, phi, e, d, keys = {};
        var currBase = 10;
        // if p and q are bitlength/2 long, n is then bitlength long
        this.bitlength = bitlength || 2048;
        console.log("Generating RSA keys of", this.bitlength, "bits");
        e = str2bigInt("65537", currBase, 0);

        while (1) {
            p = randTruePrime(this.bitlength / 2);

            if (!equalsInt(mod(p, e), 1)) //Prime must not be congruent to 1 modulo e
                break;
        }

        while (1) {
            q = randTruePrime(this.bitlength / 2);

            if (!equals(p, q) && !equalsInt(mod(q, e), 1))  //Primes must be distinct and not congruent to 1 modulo e
                break;
        }

        var one = str2bigInt("1", currBase, 0);

        n = mult(p, q);
        phi = mult(sub(p, one), sub(q, one));
        d = inverseMod(e, phi);

        //console.log(bigInt2str(n, currBase) + "\n\n" + bigInt2str(phi, currBase) + "\n\n" + bigInt2str(d, currBase));

        keys.publicKey = new rsa.publicKey(this.bitlength, n, e);
        keys.privateKey = new rsa.privateKey(p, q, d, keys.publicKey);
        return keys;
    }
};


rsa.publicKey.prototype = {
    encryptPuK: function (m) {
        return powMod(m, this.e, this.n);
    },
    decryptPuK: function (c) {
        return powMod(c, this.e, this.n);
    }
};

rsa.privateKey.prototype = {
    encryptPrK: function (m) {
        return powMod(m, this.d, this.publicKey.n);
    },
    decryptPrK: function (c) {
        return powMod(c, this.d, this.publicKey.n);
    }
};
