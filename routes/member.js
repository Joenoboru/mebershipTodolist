var express = require('express');
var models = require('../models');
var Passport = require( 'passport' );
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token')
var unflatten = require('flat').unflatten;
var moment = require('moment-timezone');
var _ = require('lodash');
var messageConstants = require('../constants/messages');
var config = require('../constants/config');
var ServerError = require('../lib/ServerError');
var refreshTokens = {};


router.post('/register', function(req, res, next) {
  var account = req.body.account;
  var password = req.body.password;

  // check parameters passed to server or not
  if (!account || !password) {
    return res.status(400).json({
      success: false,
      message: messageConstants.failure.miss.params
    });
  }

  const Members = models.Members;
  var createdAt = moment();
  Members.findOne({
    where: {
      account: {
        $ilike: account,
      },
    //查询返回的数据都为 sequelize 实例，信息太多，很多时候我们直接想要各字段的数据，raw 设置为 true 后，则返回的数据为一个 json 对象，可以直接取值，方便。
    },
    raw: true
  })
  .then(user => {
    if (user) { throw new ServerError(messageConstants.failure.existed.user, 403); }
    //throw error to stop thenflow
    bcrypt.hash(password, config.bcrypt.saltRounds, function(err, hash) {
      // create new data into database
      Members.create({
        account: account,
        password: hash,
        createdAt: createdAt
      })
      .then(payload => {
        res.status(200).json({
          success: true,
          message: messageConstants.success.registerAdminUser
        });
      })
      .catch(err => {
        res.status(err.statusCode || 400).json({
          success: false,
          message: err.errorMessage || messageConstants.failure.unknown
        });
      });
    });
  })
  .catch(err => {
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.errorMessage || messageConstants.failure.unknown
    });
  });
});

router.post('/login', function(req, res, next) {
  var account = _.trim(req.body.account);
  var password = _.trim(req.body.password);

  // check parameters passed to server or not
  if (!account || !password) {
    return res.status(400).json({
      success: false,
      message: messageConstants.failure.miss.params
    });
  }
  const Members = models.Members;

  Members.findOne({
    where: {
      account: {
        $ilike: account,
      },
    //查询返回的数据都为 sequelize 实例，信息太多，很多时候我们直接想要各字段的数据，raw 设置为 true 后，则返回的数据为一个 json 对象，可以直接取值，方便。
    },
    raw: true
  })
  .then(user => {
    // throw error if the user name not existed
    if (!user) { throw new WmsServerError(messageConstants.failure.noMatch, 403); }

    var hashPassword = user.password;

    // compare passwords
    bcrypt.compare(password, hashPassword, function(error, isMatch) {
      if (error) {
        return res.status(400).json({
          success: false,
          message: messageConstants.failure.unknown
        });
      }

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: messageConstants.failure.noMatch
        });
      }

      // delete properties
      delete user.password;

      var unflattenUserObject = unflatten(user);

      // create jwt
      var jwt_token = jwt.sign(unflattenUserObject, config.jwt.secret, {
        expiresIn: 60*60*24
      });

      var refreshToken = randtoken.uid(256);
      refreshTokens[refreshToken] = account;

      res.status(200).json({
        success: true,
        message: messageConstants.success.login,
        user: unflattenUserObject,
        "x-access-token": jwt_token,
        refreshToken: refreshToken
      });
    });
  })
  .catch(err => {
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.errorMessage || messageConstants.failure.unknown
    });
  });
});

router.post('/token', function (req, res, next) {
  var account = _.trim(req.body.account);
  var refreshToken = req.body.refreshToken;
  // check parameters passed to server or not
  if (!account || !refreshToken) {
    return res.status(400).json({
      success: false,
      message: messageConstants.failure.miss.params
    });
  }
  const Members = models.Members;

  Members.findOne({
    where: {
      account: {
        $ilike: account,
      },
    //查询返回的数据都为 sequelize 实例，信息太多，很多时候我们直接想要各字段的数据，raw 设置为 true 后，则返回的数据为一个 json 对象，可以直接取值，方便。
    },
    raw: true
  })
  .then(user => {
    // throw error if the user name not existed
    if (!user) { throw new WmsServerError(messageConstants.failure.noMatch, 403); }
    // delete properties
    delete user.password;

    var unflattenUserObject = unflatten(user);

    if((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == account)) {
      // create jwt
      var jwt_token = jwt.sign(unflattenUserObject, config.jwt.secret, {
        expiresIn: 300
      });
      res.status(200).json({
        success: true,
        user: unflattenUserObject,
        "x-access-token": jwt_token,
      });
    }
  })
  .catch(err => {
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.errorMessage || messageConstants.failure.unknown
    });
  });
});



module.exports = router;