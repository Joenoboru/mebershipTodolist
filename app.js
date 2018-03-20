var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./constants/config');
var member = require('./routes/member');
var apis_auth = require('./routes/apis.auth');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/member', member);

app.use(function (req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'x-access-token not beeing provided'
    });
  }

  jwt.verify(token, config.jwt.secret, function (err, decoded) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Authenticate error'
      });
    }

    req.decoded = decoded;
    next();
  })
});

app.use('/apis/auth', apis_auth);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
