var models = require('../../models');
var messageConstants = require('../../constants/messages');
var WmsServerError = require('../../lib/ServerError');
var utils = require('../../lib/utils');

module.exports = function(req, res, next) {
  var todoEvent = req.params.todoEvent;
  var payload = utils.decodePayloadFromAccessToken(req.headers['x-access-token']);
  var accountName = payload.account;

  var todoList = models.TodoList;

  todoList.findOne({
    where: {
      accountName: {$like: accountName},
      todoEvent: todoEvent,
      isDeleted: false,
      isFinished: false
    }
  })
  .then(todoList => {
    // throw error if the item is not found
    if (!todoList) { throw new WmsServerError(messageConstants.failure.notExisted, 403); }
    return todoList.update({
      isFinished: true,
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