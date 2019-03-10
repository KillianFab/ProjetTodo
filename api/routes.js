const express = require('express');
const router = express.Router();
const Todo = require('./modelTodo').Todo;


router.get('/todos/user/:userid', (req, res, next) => {
  Todo.find({ idUser: req.params.userid }, (err, items) => {
    
    if (err) return next(err);

    req.items = items;
    res.send(items);
    return next();
  });
});

router.post('/todos/post', (req, res, next) => {
  
  var items = req.query.items;
  var iduser = req.query.iduser;
 
  
  Todo.create({ items: items, idUser: iduser }, function (err, small) {
    if (err) return handleError(err);
    // saved!
    console.log(small);
  })
  res.send('ok');
});





module.exports = router;
