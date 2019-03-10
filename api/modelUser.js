const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Shema
const userShema = new Schema({
  username:  String,
  password: String,
  rank:   Number,
});

//define model
const User = mongoose.model('User', userShema);

module.exports.User = User;
