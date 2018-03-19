var moment = require('moment-timezone');
var _ = require('lodash');
var models = require('../../models');
var messageConstants = require('../../constants/messages');
var WmsServerError = require('../../lib/ServerError');
var utils = require('../../lib/utils');

module.exports = function(req, res, next) {
var todoEvent = req.body.todoEvent;
var todoContent = req.body.todoContent;
var payload = utils.decodePayloadFromAccessToken(req.headers['x-access-token']);
var accountName = payload.account;

var todoList = models.TodoList;
var createdAt = moment();

todoList.create({
  accountName: accountName,
  todoEvent: todoEvent,
  todoContent: todoContent,
  isFinished: false,
  createdAt: createdAt,

})
.then(payload => {
  res.status(200).json({
    success: true,
    message: messageConstants.success.create.todo,
  });
})
.catch(err => {
  console.log(err);
  res.status(err.statusCode || 400).json({
    success: false,
    message: err.errorMessage || messageConstants.failure.unknown
  });
})


}