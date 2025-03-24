var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()

var loginRouter = require('./routes/login');
var fieldsRouter = require('./routes/fields');
var reservationsRouter = require('./routes/reservations');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(loginRouter,fieldsRouter,reservationsRouter);

module.exports = app;
