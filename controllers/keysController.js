var mongoose = require('mongoose');
var bignum = require('bignum');
var sha256 = require('sha256');
var Teacher = mongoose.model('teacherModel');
var Student = mongoose.model('studentModel');
var Key = mongoose.model('keysModel');
var RSA = require('./rsa');
var Paillier = require('./paillier');

/*---------------------------------------------------------------------------------*/
// BASIC CRUD

// Get all keys
exports.getKeys = function (req, res) {
    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        res.status(200).jsonp(keys);
    });
};

// Get RSA Key
exports.getRSAKey = function (req, res) {
    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        var mongoKeys = keys[0];
        var puK = mongoKeys.get("publicKey").bits + "_" + mongoKeys.get("publicKey").n + "_" + mongoKeys.get("publicKey").e;

        res.status(200).jsonp(puK);
    });
};

// Get Paillier Key
exports.getPaillierKey = function (req, res) {
    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        var mongoKeys = keys[1];
        var puK = mongoKeys.get("publicKey").bits + "_" + mongoKeys.get("publicKey").n + "_" + mongoKeys.get("publicKey").n2 + "_" + mongoKeys.get("publicKey").g;

        res.status(200).jsonp(puK);
    });
};

// Encrypt blinded Kpu User
exports.encryptBlindKPu = function (req, res) {
    console.log('ENCRYPT Blind User-PublicKey');

    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        var blindMsg = bignum(req.body.content, base = 16);

        //var k = RSA.generateKeysFromMongo(keys[0]);
        //console.log("CLAVE RSA : " + k);

        var mongoKeys = keys[0];

        var pK = new rsa.publicKey(parseInt(mongoKeys.get("publicKey").bits), bignum(mongoKeys.get("publicKey").n), bignum(mongoKeys.get("publicKey").e)); // "get" porque el modelo es "strict: false"
        var sK = new rsa.privateKey(bignum(mongoKeys.get("privateKey").p), bignum(mongoKeys.get("privateKey").q), bignum(mongoKeys.get("privateKey").d), pK);

        var bc = sK.encryptPrK(blindMsg);
        console.log("Encrypted Blind: " + bc.toString(base = 16));

        var user = "server";

        // La PO será el hash de la información (bc)
        //console.log(user + bc.toString(base = 16));
        var POdec = bignum(sha256(user + bc.toString(base = 16)), base = 16);
        var PO = sK.encryptPrK(POdec);

        var kPu = pK.bits.toString(base = 10) + "_" + pK.n.toString(base = 10) + "_" + pK.e.toString(base = 10);

        var obj = new Object();
        obj.bc = bc.toString(base = 16);
        obj.PO = PO.toString();
        obj.kPu = kPu;
        obj.user = user;

        res.status(200).jsonp(obj);
    });
}

// Non-Repudiation - Steps 2-3
exports.nonRepudiation = function (req, res) {
    console.log('NON-REPUDIATION Steps 2-3');

    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        var mongoKeys = keys[0];

        var pK = new rsa.publicKey(parseInt(mongoKeys.get("publicKey").bits), bignum(mongoKeys.get("publicKey").n), bignum(mongoKeys.get("publicKey").e)); // "get" porque el modelo es "strict: false"
        var sK = new rsa.privateKey(bignum(mongoKeys.get("privateKey").p), bignum(mongoKeys.get("privateKey").q), bignum(mongoKeys.get("privateKey").d), pK);

        // Step 2
        var bc = req.body.bc;
        var PR = req.body.PR;
        var user = req.body.user;
        var kPuUser = new rsa.publicKey(parseInt(req.body.kPu.split("ABABAB")[0]), req.body.kPu.split("ABABAB")[2], req.body.kPu.split("ABABAB")[1]);

        if (sha256(user + bc) === kPuUser.decryptPuK(bignum(PR, base = 16)).toString(base = 16))
            console.log("Step 2 Non-Repudiation -> SUCCESSFUL");
        else
            console.log("Step 2 Non-Repudiation -> FAILED");

        // Step 3
        var r = bignum.prime(512);

        var user2 = "server";

        var POdec = bignum(sha256(user2 + r.toString()), base = 16);
        var PO = sK.encryptPrK(POdec);

        var kPu = pK.bits.toString(base = 10) + "_" + pK.n.toString(base = 10) + "_" + pK.e.toString(base = 10);

        var obj = new Object();
        obj.r = r.toString();
        obj.PO = PO.toString();
        obj.kPu = kPu;
        obj.user = user2;

        res.status(200).jsonp(obj);
    });
}

// Non-Repudiation - Step 4
exports.nonRepudiationStep4 = function (req, res) {
    console.log('NON-REPUDIATION Step 4');

    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        var mongoKeys = keys[0];

        var pK = new rsa.publicKey(parseInt(mongoKeys.get("publicKey").bits), bignum(mongoKeys.get("publicKey").n), bignum(mongoKeys.get("publicKey").e)); // "get" porque el modelo es "strict: false"
        var sK = new rsa.privateKey(bignum(mongoKeys.get("privateKey").p), bignum(mongoKeys.get("privateKey").q), bignum(mongoKeys.get("privateKey").d), pK);

        // Step 4
        var r = req.body.r;
        var PR = req.body.PR;
        var user = req.body.user;
        var kPuUser = new rsa.publicKey(parseInt(req.body.kPu.split("ABABAB")[0]), req.body.kPu.split("ABABAB")[2], req.body.kPu.split("ABABAB")[1]);

        if (sha256(user + r) === kPuUser.decryptPuK(bignum(PR, base = 16)).toString(base = 16))
            console.log("Step 4 Non-Repudiation -> SUCCESSFUL");
        else
            console.log("Step 4 Non-Repudiation -> FAILED");

        res.status(200).jsonp("Non-Repudiation COMPLETED");
    });
}

// Decrypt unblinded Kpu user
exports.decryptUnblindKPu = function (req, res) {
    console.log('DECRYPT Unblind User-PublicKey');

    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        var unblindedEnc = bignum(req.body.content, base = 16);

        var mongoKeys = keys[0];

        var pK = new rsa.publicKey(parseInt(mongoKeys.get("publicKey").bits), bignum(mongoKeys.get("publicKey").n), bignum(mongoKeys.get("publicKey").e)); // "get" porque el modelo es "strict: false"
        var sK = new rsa.privateKey(bignum(mongoKeys.get("privateKey").p), bignum(mongoKeys.get("privateKey").q), bignum(mongoKeys.get("privateKey").d), pK);

        console.log(unblindedEnc);
        d = pK.decryptPuK(unblindedEnc);
        console.log("Decrypted: " + d.toString(base = 16));

        dStr = d.toString(base = 16);
        var pKUser = new rsa.publicKey(parseInt(dStr.split("ababab")[0]), dStr.split("ababab")[1], dStr.split("ababab")[2]);
        console.log(pKUser);

        res.status(200).jsonp(d.toString(base = 16));
    });
}

// Generate Paillier keys
exports.generatePaillierKeys = function (req, res) {
    console.log('GENERATE Paillier Keys');

    //Key.findOne({keyType: req.body.keyType}, function (err, key) {
    //    if (!key) {
    keys = Paillier.generateKeys(2048);
    var mongoKeys = Paillier.generateMongoKeys(keys);
    console.log(keys);
    console.log(mongoKeys);

    var key = new Key({
        publicKey: mongoKeys.publicKey,
        privateKey: mongoKeys.privateKey
    });


    key.save(function (err) {
        if (!err)
            console.log('KEY generated');
        else
            console.log('ERROR', +err);
    });

    res.send(Key._id);
    //} else {
    //    res.send('There already exists a Paillier Key');
    //}

    //})
};

// Generate RSA keys
exports.generateRSAKeys = function (req, res) {
    console.log('GENERATE RSA Keys');

    //Key.findOne({keyType: req.body.keyType}, function (err, key) {
    //    if (!key) {
    keys = RSA.generateKeys(2048);
    var mongoKeys = RSA.generateMongoKeys(keys);
    console.log(keys);
    console.log(mongoKeys);

    var key = new Key({
        publicKey: mongoKeys.publicKey,
        privateKey: mongoKeys.privateKey
    });


    key.save(function (err) {
        if (!err)
            console.log('KEY generated');
        else
            console.log('ERROR', +err);
    });

    res.send(Key._id);
    //} else {
    //    res.send('There already exists a RSA Key');
    //}

    //})
};

// Delete Key
exports.deleteKey = function (req, res) {
    Key.findOne({"_id": req.params._id}, function (err, Key) {
        Key.remove(function (err) {
            if (!err)
                console.log('Key deleted');
            else
                console.log('ERROR: ' + err);
        })
    });
    res.status(200).send('Delete');
};