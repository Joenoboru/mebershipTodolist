var moment = require('moment-timezone');
var _ = require('lodash');
var models = require('../../models');
var messageConstants = require('../../constants/messages');
var WmsServerError = require('../../lib/ServerError');
var utils = require('../../lib/utils');

module.exports = function(req, res, next) {
  var payload = utils.decodePayloadFromAccessToken(req.headers['x-access-token']);
  var accountName = payload.account;

  var todoList = models.TodoList;

  todoList.findAll({
    where: {
      accountName: {$like: accountName},
      isFinished: false,
      isDeleted: false,
    },
    raw: true
  })
  .then(todoList => {
    console.log(todoList);
    // throw error if the item is not found
    if (!todoList) { throw new WmsServerError(messageConstants.failure.notExisted, 403); }
    let clearTodoList = todoList;
    _.map(clearTodoList, function(i) {
      delete i.isFinished;
      delete i.isDeleted;
      delete i.createdAt;
      delete i.deletedAt;
    })
    res.status(200).json({
      success: true,
      todoList: clearTodoList
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