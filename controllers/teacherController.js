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
                subjects: req.body.subjects
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
    Teacher.findOneAndUpdate(req.params.id, function (err, teacher) {
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

// Get teachers matching students' subjects
exports.getTeachersBySubject = function (req, res) {
    console.log('GET teachers that teach a subject');

    Student.findById(req.params._id, function (err, student) {
        if (err) res.send(500, err.message);
        console.log(student.subjects);

        var teachers = [];

        for (var i = 0; i < student.subjects.length; i++) {
            Teacher.find({"subjects": student.subjects[i]}, function (err, teacher) {
                if (err) res.send(500, err.message);

                for (var j = 0; j < teacher.length; j++) {
                    teachers.push(teacher[j]);
                }
            });
        }

        console.log(teachers);

        res.status(200).jsonp(teachers);
    });
};

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

/*// GET by ID
 exports.findById = function (req, res) {
 teacher.findById(req.params.id, function (err, nrTTP) {
 if (err) return res.send(500, err.message);

 console.log('GET /nrTTP/' + req.params.id);
 res.status(200).jsonp(nrTTP);
 });
 };

 */