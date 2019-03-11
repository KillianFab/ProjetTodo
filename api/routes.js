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
  console.log(req);
  var items = req.query.items;
  var iduser = req.query.iduser;
 
  
  Todo.create({ items: items, idUser: iduser }, function (err, todo) {
    if (err) return handleError(err);
    // saved!
    console.log();
    res.send(todo._id);
  })
});

router.post('/todos/post/delete', (req, res, next) => {
  var id = req.query.id;
  
  Todo.remove({"_id": id}, function (err, remove) {
    if (err) return handleError(err);
    res.send('ok')
  }
  
  );
  // Todo.create({ items: items, idUser: iduser }, function (err, small) {
  //   if (err) return handleError(err);
  //   // saved!
  //   console.log(small);
  // })
  // res.send('ok');
});





module.exports = router;
