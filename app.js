var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose');

// Connection to DB
mongoose.connect('mongodb://localhost/learnShare', function (err, res) {
    if (err) throw err;
    console.log('Connected to Database');
});

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
/*var models = require('./models/commentModel')(app, mongoose);
 var models = require('./models/subjectModel')(app, mongoose);*/
var models = require('./models/studentModel')(app, mongoose);
var models = require('./models/teacherModel')(app, mongoose);
var models = require('./models/commentModel')(app, mongoose);
var studentController = require('./controllers/studentController');
var teacherController = require('./controllers/teacherController');
var commentController = require('./controllers/commentController');

// Example Route
var router = express.Router();
router.get('/', function (req, res) {
    res.send("Learn-Share is working!");
});

app.use(router);
//app.use('/api', nrBs);

// Start server
app.listen(3000, function () {
    console.log("Node server running on http://localhost:3000");
});

// Define API routes
var backend = express.Router();
app.use(backend);

backend.route('/students')
    .get(studentController.getStudents)
    .post(studentController.addStudent);
backend.route('/student/:_id')
    .get(studentController.findByUsername)
    .put(studentController.updateStudent)
    .delete(studentController.deleteStudent);

backend.route('/teachers')
    .get(teacherController.getTeachers)
    .post(teacherController.addTeacher);
backend.route('/teacher/:_id')
    .get(teacherController.findByUsername)
    .put(teacherController.updateTeacher)
    .delete(teacherController.deleteTeacher);
backend.route('/teachers/:_id')
    .get(teacherController.getTeachersBySubject);
backend.route('/teachersVotes')
    .get(teacherController.getTeachersMostVoted);
backend.route('/voteTeacher/:_id')
    .get(teacherController.voteTeacher);

backend.route('/comments')
    .get(commentController.getComments)
    .post(commentController.addComment);
backend.route('/comments/:_id')
    .get(commentController.findByTeacher);
backend.route('/comment/:_id')
    .put(commentController.updateComment);

/*backend.route('/nrttp/:id')
 .get(NrBController.findById)
 .put(NrBController.updateNrTTP)
 .delete(NrBController.deleteNrTTP);

 backend.route('/nra')
 .post(NrBController.getPO);*/