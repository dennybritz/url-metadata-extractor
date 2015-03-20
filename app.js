'use strict';

require('dotenv').load();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var log = require('blikk-logjs')('app');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Bunyan logging middleware
app.use(function(req, res, next){
  log.info({req: req});
  next();
});

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error({req: req, err: err});
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  log.error({req: req, err: err});
  res.send(err.message);
});

module.exports = app;
