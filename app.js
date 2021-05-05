const express = require('express');

const createError = require('http-errors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const logger = require('morgan');
const path = require('path');

const connectMongo = require('connect-mongo');
const MongoStore = connectMongo(session);
const mongoose = require('./libs/mongoose');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const kittensRouter = require('./routes/kitten');
const logoutRouter = require('./routes/logout');

app.use(session({
    secret: "1234567890",
    key: "sid",
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null,
        secure: false
    },
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: true,
    saveUninitialized: true
}));

app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/kittens', kittensRouter);
app.use('/logout', logoutRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
