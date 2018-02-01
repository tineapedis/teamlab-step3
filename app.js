var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var color = require('./routes/color');
var login = require('./routes/login');
var routes = require('./routes/index');
var opponent = require('./routes/opponent');
var battle = require('./routes/battle');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));

var sessionCheck = function(req, res, next) {
  console.log("----------- チェック入ります -------------");
  if (req.session.user) {
    res.render('index');
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/battle', battle);

app.post('/editicon', routes);
app.get('/user', routes);
app.get('/colorlist', routes);

app.get('/color', color);
app.post('/color', color);

app.get('/opponent', opponent);

app.post('/signup', login);
app.use('/login', login)
app.get('/', sessionCheck, routes);
app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

app.use('/users', users);

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
