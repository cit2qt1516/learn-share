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

        console.log('GET /keys');
        res.status(200).jsonp(keys);
    });
};

exports.encryptBlindKPu = function (req, res) {
    console.log('ENCRYPT Blind User-PublicKey');

    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        // CLAVE RSA, NO PAILLIER


        var bc = keys.privateKey.encrypt(blindMsg);
        //res.status(200).jsonp(keys);
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
        keys: mongoKeys
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