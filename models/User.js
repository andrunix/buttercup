var mongoose = require('mongoose');
var mongo = 'mongodb://localhost/buttercup';
mongoose.connect(mongo);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function callback () {
    console.log("DB Opened successfully");
});

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);
