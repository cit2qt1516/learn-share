var mongoose = require('mongoose');
var bignum = require('bignum');
var sha256 = require('sha256');
var Student = mongoose.model('studentModel');
var RSA = require('./rsa');

/*---------------------------------------------------------------------------------*/
// BASIC CRUD

// Get all students
exports.getStudents = function (req, res) {
    Student.find(function (err, student) {
        if (err) res.send(500, err.message);

        console.log('GET /students');
        res.status(200).jsonp(student);
    });
};

// Create student account
exports.addStudent = function (req, res) {
    console.log('POST /student');
    console.log(req.body);

    Student.findOne({username: req.body.username}, function (err, student) {
        if (!student) {
            var student = new Student({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                pass: req.body.pass,
                subjects: req.body.subjects
            });

            student.save(function (err) {
                if (!err)
                    console.log('Student added');
                else
                    console.log('ERROR', +err);
            });

            res.send(student._id);
        } else {
            res.send('Ese usuario ya está en uso');
        }

    })
}

// Update an existent student
exports.updateStudent = function (req, res) {
    Student.findOneAndUpdate({"_id": req.params._id}, req.body, function (err, student) {
        console.log("UPDATE");
        student.set(function (err) {
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

// Delete student account
exports.deleteStudent = function (req, res) {
    Student.findOne({"_id": req.params._id}, function (err, student) {
        student.remove(function (err) {
            if (!err)
                console.log('Student deleted');
            else
                console.log('ERROR: ' + err);
        })
    });
    res.status(200).send('Delete');
};

/*---------------------------------------------------------------------------------*/
// OTHER FUNCTIONS

// Get student by username
exports.findByUsername = function (req, res) {
    var user = "username:" + req.params._id;

    Student.findOne(user, function (err, student) {
        if (!err) {
            res.send(student);
        }
        else {
            console.log('ERROR: ' + err);
        }
    });
};