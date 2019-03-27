

//Fichier de configuration


/*
* inclusion des middelwares
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');


//Middelware pour l'authentification
var passport = require('passport');
require('./passport')(passport)

//Connection à la base de donnée (nommée Login)
// elle contient deux collections : users (voir le schéma db/User) et games (voir le schéma db/Game )
mongoose.connect('mongodb://localhost:27017/Login')


/*
* on inclut les différentes routes de notre serveur définies dans le répertoire routes
*/
var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth')(passport);


// définition de notre application express
var app = express();

// configuration du moteur des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




/*
* on indique que l'on utilise nos middelwares
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'thesecret',
  saveUninitialized: false,
  resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth)

// pour attraper les erreurs 404 et les diriger vers le erro handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // rends la page d'erreur
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
