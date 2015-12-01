exports = module.exports = function(app, mongoose) {

    var studentSchema = new mongoose.Schema({
        name: 		{ type: String },
        email: 		{ type: String },
        pass: 		{ type: String },
        lat: 	{ type: String },
        long:  	{ type: String },
        subjects: [{type: String}],
        hasvoted: [{type: String}]
    });

    mongoose.model('studentModel', studentSchema);
};