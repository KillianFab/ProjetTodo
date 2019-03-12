const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Shema
const TodoShema = new Schema({
  items:  String,
  idUser: String,
});
//define model
const Todo = mongoose.model('todo', TodoShema);

module.exports.Todo = Todo;
