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

        console.log('GET /student');
        res.status(200).jsonp(student);
    });
};

// Create student account
exports.addStudent = function (req, res) {
    console.log('POST /student');
    console.log(req.body);

    Student.findOne({email: req.body.email}, function (err, student) {
        if (!student) {
            var student = new Student({
                name: req.body.name,
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
            res.send('Ese email ya está en uso');
        }

    })
}

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



/*//GET by ID
exports.findById = function (req, res) {
    student.findById(req.params.id, function (err, nrTTP) {
        if (err) return res.send(500, err.message);

        console.log('GET /nrTTP/' + req.params.id);
        res.status(200).jsonp(nrTTP);
    });
};

//PUT - Update a register already exists
exports.updatestudent = function (req, res) {
    student.findOneAndUpdate(req.params.id, function (err, nrttp) {
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
*/