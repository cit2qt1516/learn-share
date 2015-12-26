var mongoose = require('mongoose');
var bignum = require('bignum');
var sha256 = require('sha256');
var Teacher = mongoose.model('teacherModel');
var Student = mongoose.model('studentModel');
var Vote = mongoose.model('voteModel');
var Key = mongoose.model('keysModel');
var RSA = require('./rsa');

/*---------------------------------------------------------------------------------*/
// BASIC CRUD

// Get all teachers
exports.getTeachers = function (req, res) {
    Teacher.find(function (err, teacher) {
        if (err) res.send(500, err.message);

        console.log('GET /teachers');
        res.status(200).jsonp(teacher);
    });
};

// Create teacher account
exports.addTeacher = function (req, res) {
    console.log('POST /teacher');
    console.log(req.body);

    Teacher.find(function (err, teachers) {
        Teacher.findOne({username: req.body.username}, function (err, teacher) {
            if (!teacher) {
                var teacher = new Teacher({
                    name: req.body.name,
                    username: req.body.username,
                    id: teachers.length,
                    email: req.body.email,
                    pass: req.body.pass,
                    subjects: req.body.subjects,
                    votes: 0,
                    lat: req.body.lat,
                    long: req.body.long
                });

                teacher.save(function (err) {
                    if (!err)
                        console.log('Teacher added');
                    else
                        console.log('ERROR', +err);
                });

                res.send(teacher._id);
            } else {
                res.send('Ese username ya está en uso');
            }

        })
    });
}

// Update a teacher
exports.updateTeacher = function (req, res) {
    Teacher.findOneAndUpdate({"_id": req.params._id}, req.body, function (err, teacher) {
        console.log("UPDATE");
        teacher.set(function (err) {
            if (!err) {
                console.log('Updated');
            }
            else {
                console.log('ERROR' + err);
            }
        });
        res.send('Modified');
    });
};

// Delete teacher account
exports.deleteTeacher = function (req, res) {
    Teacher.findOne({"_id": req.params._id}, function (err, teacher) {
        teacher.remove(function (err) {
            if (!err)
                console.log('Teacher deleted');
            else
                console.log('ERROR: ' + err);
        })
    });
    res.status(200).send('Delete');
};

/*---------------------------------------------------------------------------------*/
// OTHER FUNCTIONS

// Get teacher by username
exports.findByUsername = function (req, res) {
    Teacher.findOne({username: req.params._id}, function (err, teacher) {
        if (!err) {
            res.send(teacher);
        }
        else {
            console.log('ERROR: ' + err);
        }
    });
};

// Get teachers matching students' subjects
exports.getTeachersBySubject = function (req, res) {
    console.log('GET teachers that teach a subject');

    Student.findById(req.params._id, function (err, student) {
        if (err) res.send(500, err.message);
        console.log(student.subjects);

        var teachers = [];

        Teacher.find({"subjects": {$in: student.subjects}}, function (err, teacher) {
            if (err) res.send(500, err.message);

            for (var j = 0; j < teacher.length; j++) {
                teachers.push(teacher[j]);
            }

            res.status(200).jsonp(teachers);
        });
    });
};

// Get teachers with most votes
exports.getTeachersMostVoted = function (req, res) {
    console.log('GET the most voted teachers for each subject');

    var subjects = ["Historia", "Música"];
    var teachers = [];

    Teacher.find({"subjects": {$in: subjects}}).sort("-votes").exec(function (err, teacher) {
        if (err) res.send(500, err.message);

        for (var i = 0; i < teacher.length; i++) {
            var sub = teacher[i].subjects[0];
            var pos = subjects.indexOf(sub);
            if (pos > -1) {
                subjects.splice(pos, 1);
                teachers.push(teacher[i]);
            }
        }

        res.status(200).jsonp(teachers);
    });
};

// Update a teacher
exports.voteTeacher = function (req, res) {
    var conditions = {_id: req.params._id}
        , update = {$inc: {votes: 1}};

    Teacher.update(conditions, update, function (err, teacher) {
        console.log("Vote teacher");

        res.send('Voted');
    });
};

// Vote
exports.vote = function (req, res) {
    console.log('VOTE');
    console.log(req.body);

    Vote.findOne({token: req.body.token}, function (err, vote) {
        if (!vote) {
            var vote = new Vote({
                voteC: req.body.voteC,
                voteR: req.body.voteR,
                sign: req.body.sign,
                token: req.body.token
            });

            vote.save(function (err) {
                if (!err)
                    console.log('Vote added');
                else
                    console.log('ERROR', +err);
            });

            res.send(vote._id);
        } else {
            res.send('Ya se ha votado con este token');
        }

    })
};

// Get all votes
exports.getVotes = function (req, res) {
    Vote.find(function (err, vote) {
        if (err) res.send(500, err.message);

        console.log('GET /votes');
        res.status(200).jsonp(vote);
    });
};

// Delete all votes
exports.deleteVotes = function (req, res) {
    Vote.find(function (err, vote) {
        for (var i = 0; i < vote.length; i++) {
            vote[i].remove(function (err) {
                if (!err)
                    console.log('Vote deleted');
                else
                    console.log('ERROR: ' + err);
            })
        }
    });
    res.status(200).send('Delete');
};

// Count votes
exports.countVotes = function (req, res) {
    Key.find(function (err, keys) {
        if (err) res.send(500, err.message);

        var mongoKeys = keys[1];

        var pK = new paillier._publicKey(parseInt(mongoKeys.get("publicKey").bits), bignum(mongoKeys.get("publicKey").n), bignum(mongoKeys.get("publicKey").n2), bignum(mongoKeys.get("publicKey").g)); // "get" porque el modelo es "strict: false"
        var sK = new paillier._privateKey(bignum(mongoKeys.get("privateKey").lambda), bignum(mongoKeys.get("privateKey").mu), bignum(mongoKeys.get("privateKey").p), bignum(mongoKeys.get("privateKey").q), pK);

        Vote.find(function (err, vote) {
            if (err) res.send(500, err.message);
            console.log('COUNT /votes');

            var encryptedSum = 1;
            for (var i = 0; i < vote.length; i++) {
                encryptedSum = bignum(encryptedSum).mul(bignum(vote[i].voteC)).mod(pK.n2);
            }

            var sum = sK.decrypt(encryptedSum);
            console.log("Decryption of vote[0]*vote[1]:", sum.toString());

            var bin = (sum >>> 0).toString(2);
            console.log("ORI: " + bin);
            if ((bin.length % 6) != 0) {
                var zeros = "";
                for (var i = 0; (i < (6 - bin.length % 6)); i++)
                    zeros += "0";
                var binRes = [bin.slice(0, 0), zeros, bin.slice(0)].join('');
            }
            console.log("RES: " + binRes);

            var votes = [];
            votes = binRes.match(/.{1,6}/g);
            for (var i = 0; (i < votes.length); i++) {
                var numVotes = parseInt(votes[i], 2);
                console.log("Teacher " + i + " gets " + numVotes + " votes.");
            }

            res.status(200).jsonp(sum.toString());
        });
    });
};