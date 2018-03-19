var express = require('express');
var router = express.Router();


//GET actions
// var apiListTodo = require('./list/listTodo');
// router.get('/list/todo', apiListTodo);

//POST actions
var apiCreateTodo = require('./create/createTodo');
router.post('/create/todo', apiCreateTodo);

//DELETE actions
// var apiDeleteTodo = require('./delete/deleteTodo');
// router.get('/delete/todo', apiDeleteTodo);

//UPDATE actions
// var apiUpdateTodo = require('./update/updateTodo');
// router.get('/update/todo', apiUpdateTodo);


module.exports = router;