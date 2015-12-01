exports = module.exports = function(app, mongoose) {

    var subjectSchema = new mongoose.Schema({
        subject: 		{ type: String },
        color: 		{ type: String }
    });

    mongoose.model('subjectModel', subjectSchema);
};