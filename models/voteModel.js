exports = module.exports = function(app, mongoose) {

    var voteSchema = new mongoose.Schema({
        voteC: 		{ type: String },
        voteR: 		{ type: String },
        sign: 		{ type: String },
        token: 		{ type: String }
    });

    mongoose.model('voteModel', voteSchema);
};