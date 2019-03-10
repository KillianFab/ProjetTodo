const express = require('express');
const routes = require('./routes');
const app = express();

const jsonParser = require('body-parser').json;
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/app');
const db = mongoose.connection;

db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});


app.use(jsonParser());

app.use('/api', routes)
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})