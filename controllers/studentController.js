var mongoose = require('mongoose');
var bignum = require('bignum');
var sha256 = require('sha256');
var Student = mongoose.model('studentModel');
var Teacher = mongoose.model('teacherModel');
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
                subjects: req.body.subjects,
                lat: req.body.lat,
                long: req.body.long
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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    d = d * 1000 //distancias en metros
    return d; //en metros
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

exports.findTeacherOffersPlace = function (req, res) {
    Student.findById(req.params._id, function (err, student) {
        var subjects = student.subjects;
        var latitud = student.lat;
        var longitud = student.long;
        if (err) res.send(500, err.message);
        console.log(student.subjects);
        Teacher.find({"subjects": {$in: student.subjects}}, function (err, teachers) {
            for ( var i = 0; i < teachers.length; i++) {
                var distancia = getDistanceFromLatLonInKm(latitud, longitud, teachers[i].lat, teachers[i].long);
                teachers[i].distance = distancia;

            }
            //if (distancia <= 30000) {
            //    var teacher = ({
            //        name: teachers[i].name,
            //        id: teachers[i]._id,
            //        distance: distancia
            //    });
            //if (teacher.id != req.params._id) {
            //
            //    teachers.push(teacher);
            //    console.log(JSON.stringify(teachers));
            //} else {
            //    res.send("eres tu")
            //}
            //}

            res.status(200).json(teachers);
        })
    });
}

