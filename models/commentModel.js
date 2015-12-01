exports = module.exports = function(app, mongoose) {

    var commentSchema = new mongoose.Schema({
        content: 		{ type: String },
        student: 		{ type: String },
        teacher: 		{ type: Number },
        time: 	{ type: String }
    });

    mongoose.model('commentModel', commentSchema);
};