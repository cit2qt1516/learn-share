var mongoose = require('mongoose');
var bignum = require('bignum');
var sha256 = require('sha256');
var Student = mongoose.model('studentModel');
var Teacher = mongoose.model('teacherModel');
var RSA = require('./rsa');
var crypto = require('crypto');
var fs = require('fs');

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
    var name = req.body.username;
    var pass = req.body.pass;
    var passEncriptada = encriptar(name, pass);

    Student.findOne({username: req.body.username}, function (err, student) {
        if (!student) {
            var student = new Student({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                pass: passEncriptada,
                subjects: req.body.subjects,
                profile: "student",
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
    Student.findOneAndUpdate({username: req.params._id}, req.body, function (err, student) {
        console.log("UPDATE");
        student.set(function (err) {
            if (!err) {
                console.log('Updated');
            }
            else {
                console.log('ERROR' + err);
            }
        });
        res.status(200).jsonp('Modified');
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
    Student.findOne({username: req.params._id}, function (err, student) {
        if (!err) {
            res.send(student);
        }
        else {
            console.log('ERROR: ' + err);
        }
    });
};

// Update the teachers a student has voted
exports.updateVoteStudent = function (req, res) {
    Student.findOne({username: req.params._id}, function (err, student) {
        console.log("UPDATE VOTES");
        student.hasvoted[student.hasvoted.length] = req.body.teacher;
        var s = new Object();
        s.hasvoted = student.hasvoted;
        Student.findOneAndUpdate({username: req.params._id}, s, function (err, stud) {
            stud.set(function (err) {
                if (!err) {
                    console.log('Votes updated');
                }
                else {
                    console.log('ERROR' + err);
                }
            });
        });
        res.send('Votes updated');
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
        var latitud = student.lat;
        var longitud = student.long;
        if (err) res.send(500, err.message);
        console.log(student.subjects);
        Teacher.find({"subjects": {$in: student.subjects}}, function (err, teachers) {
            var teach = [];
            for (var i = 0; i < teachers.length; i++) {
                var distancia = getDistanceFromLatLonInKm(latitud, longitud, teachers[i].lat, teachers[i].long);
                if (!isNaN(distancia)) {
                    teachers[i].distance = distancia;
                    teach.push(teachers[i]);
                }

            }
            teach.sort("-distance");
            console.log(teach);
            res.status(200).json(teach);
        })
    });
}

function encriptar(user, pass) {

    // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
    var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex')
    return hmac
}

//Login
exports.loginUser = function (req, res) {
    console.log('LOGIN user');

    var name = req.body.username;
    var pass = req.body.pass;
    var passEncriptada = encriptar(name, pass);
    console.log(passEncriptada);
    Student.findOne({"username": name}, function (err, student) {
        if (student) {
            if (student.pass == passEncriptada) {
                res.status(200).jsonp({
                    ID: student._id,
                    username: student.username,
                    profile: student.profile
                    //username:user.username
                });
            } else {
                console.log("contraseña incorrecta");
                res.send('contraseña incorrecta');
            }

        } else {
            Teacher.findOne({username: req.body.username}, function (err, teacher) {
                if (teacher) {
                    if (teacher.pass == passEncriptada) {
                        res.status(200).jsonp({
                            ID: teacher._id,
                            username: teacher.username,
                            profile: teacher.profile
                            //username:user.username
                        });
                    } else {
                        console.log("contraseña incorrecta");
                        res.send('contraseña incorrecta');
                    }
                }
            })
        }
    });
}

//exports.addImages = function (req, res) {
//
//    req.files.file.name = req.params._id + '.jpg';
//
//    var tmp_path = req.files.file.path;
//
//    // Ruta donde colocaremos las imagenes
//    var target_path = './web/avatarUser/' + req.files.file.name;
//
//    // Comprobamos que el fichero es de tipo imagen
//    if (req.files.file.type.indexOf('image') == -1) {
//        res.send('El fichero que deseas subir no es una imagen');
//    } else {
//        // Movemos el fichero temporal tmp_path al directorio que hemos elegido en target_path
//        fs.rename(tmp_path, target_path, function (err) {
//            console.log(err);
//
//            if (err) throw err;
//            // Eliminamos el fichero temporal
//            fs.unlink(tmp_path, function () {
//                if (err) throw err;
//
//                Student.findOneAndUpdate({"_id": req.params._id}, req.body, function (err, student) {
//
//                    if (!err) {
//                        var nom = student._id;
//                        student.avatar = nom;
//
//                        student.save(function (err) {
//                            if (!err) {
//                                console.log('Updated');
//                                res.send('Update')
//                            }
//                            else {
//                                console.log('ERROR' + err);
//                            }
//
//                        })
//                    }
//                });
//
//            });
//
//        });
//
//    }
//};
