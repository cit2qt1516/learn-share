exports = module.exports = function (app, mongoose) {

    var keysSchema = new mongoose.Schema({
        keyType:    { type: String }
    }, {strict: false}); // Strict=false permite que se guarde cualquier estructura de datos en MongoDB

    mongoose.model('keysModel', keysSchema);
};