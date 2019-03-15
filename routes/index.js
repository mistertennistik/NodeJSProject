var express = require('express');
var router = express.Router();


var User = require('../db/User');

var Game = require('../db/Game');

var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.get('/login', function (req, res, next) {
  res.render('login');
});


router.get('/signup', function (req, res, next) {
  res.render('signup');
});


router.get('/profile', loggedin, function (req, res, next) {


  Game.find({}, function(err, games) {
            console.log(games);
           res.render('profile', {games: games,
            user:req.user});
        });
  /*User.find({}, function(err, users) {
      console.log(users);
           res.render('profile', {users: users,
            user:req.user});
        });*/
});

router.get('/PlusOrMinus', function (req, res, next) {
  res.render('PlusOrMinus');
});


router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})
module.exports = router;