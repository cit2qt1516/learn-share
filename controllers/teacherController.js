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

        console.log('GET /teacher');
        res.status(200).jsonp(teacher);
    });
};

// Create teacher account
exports.addTeacher = function (req, res) {
    console.log('POST /teacher');
    console.log(req.body);

    Teacher.findOne({email: req.body.email}, function (err, teacher) {
        if (!teacher) {
            var teacher = new Teacher({
                name: req.body.name,
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
            res.send('Ese email ya está en uso');
        }

    })
}

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
        console.log(student);

        Teacher.find({"subjects": student.subjects}, function (err, teacher) {
            if (err) res.send(500, err.message);

            res.status(200).jsonp(teacher);
        });
    });
};

/*//GET by ID
exports.findById = function (req, res) {
    teacher.findById(req.params.id, function (err, nrTTP) {
        if (err) return res.send(500, err.message);

        console.log('GET /nrTTP/' + req.params.id);
        res.status(200).jsonp(nrTTP);
    });
};

//PUT - Update a register already exists
exports.updateteacher = function (req, res) {
    teacher.findOneAndUpdate(req.params.id, function (err, nrttp) {
        nrttp.set(function (err) {
            //if(err) return res.send(500, err.message);
            //res.status(200).jsonp(nrttp);
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

//DELETE -
exports.deleteteacher = function (req, res) {
    teacher.findOne({"_id": req.params.id}, function (err, nrttp) {
        nrttp.remove(function (err) {
            //if(err) return res.send(500, err.message);
            if (!err) {
                console.log('Object delete');
            }
            else {
                console.log('ERROR: ' + err);
            }
        })
    });
    res.status(200).send('Delete');
};*/