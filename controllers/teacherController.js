var mongoose = require('mongoose');
var bignum = require('bignum');
var sha256 = require('sha256');
var Teacher = mongoose.model('teacherModel');
var Student = mongoose.model('studentModel');
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

    Teacher.findOne({username: req.body.username}, function (err, teacher) {
        if (!teacher) {
            var teacher = new Teacher({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                pass: req.body.pass,
                subjects: req.body.subjects,
                votes: 0
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
    var user = "username:" + req.params._id;

    Teacher.findOne(user, function (err, teacher) {
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