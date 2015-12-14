exports = module.exports = function(app, mongoose) {

    var commentSchema = new mongoose.Schema({
        content: 		{ type: String },
        student: 		{ type: String },
        teacher: 		{ type: String },
        time: 	{ type: String }
    });

    mongoose.model('commentModel', commentSchema);
};