exports = module.exports = function(app, mongoose) {

    var teacherSchema = new mongoose.Schema({
        name: 		{ type: String },
        username: 		{ type: String },
        id:         { type: Number },
        email: 		{ type: String },
        pass: 		{ type: String },
        lat: 	{ type: String },
        long:  	{ type: String },
        subjects: [{type: String}],
        votes: { type: Number },
        distance : {type:Number}
    });

    mongoose.model('teacherModel', teacherSchema);
};