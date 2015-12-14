var mongoose = require('mongoose');
var bignum = require('bignum');
var sha256 = require('sha256');
var Teacher = mongoose.model('teacherModel');
var Student = mongoose.model('studentModel');
var Comment = mongoose.model('commentModel');
var RSA = require('./rsa');

/*---------------------------------------------------------------------------------*/
// BASIC CRUD

// Get all comments
exports.getComments = function (req, res) {
    Comment.find(function (err, comment) {
        if (err) res.send(500, err.message);

        console.log('GET /comments');
        res.status(200).jsonp(comment);
    });
};

// Create comment account
exports.addComment = function (req, res) {
    console.log('POST /comment');
    console.log(req.body);

    var today = new Date();
    var date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes();

    var comment = new Comment({
        content: req.body.content,
        student: req.body.student,
        teacher: req.body.teacher,
        time: date
    });

    comment.save(function (err) {
        if (!err)
            console.log('Comment added');
        else
            console.log('ERROR', +err);
    });

    res.send(comment._id);
}

// Update a comment
exports.updateComment = function (req, res) {
    Comment.findOneAndUpdate({"_id": req.params._id}, req.body, function (err, comment) {
        console.log("UPDATE");
        comment.set(function (err) {
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

// Delete comment account
exports.deleteComment = function (req, res) {
    Comment.findOne({"_id": req.params._id}, function (err, comment) {
        comment.remove(function (err) {
            if (!err)
                console.log('Comment deleted');
            else
                console.log('ERROR: ' + err);
        })
    });
    res.status(200).send('Delete');
};

/*---------------------------------------------------------------------------------*/
// OTHER FUNCTIONS

// Get comment by teacher
exports.findByTeacher = function (req, res) {
    Comment.find({"teacher" : req.params._id}, function (err, comments) {
        if (!err) {
            res.send(comments);
        }
        else {
            console.log('ERROR: ' + err);
        }
    });
};