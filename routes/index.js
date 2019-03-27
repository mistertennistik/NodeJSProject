var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());


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

 console.log("------ On entre dans la méthode. ---------");

/*User.test(
"5c99dab646ea8413063683dc", res);*/


var max={
  fakeJeu1: 0,
  fakeJeu2: 0,
  PlusOrMinus: 0,

};
(async () => {
    try {

      console.log(req.user.username);
        max.fakeJeu1 = await User.getUserHighScore(req.user.username,"fakeJeu1");
        max.fakeJeu2 = await User.getUserHighScore(req.user.username,"fakeJeu2");
        max.PlusOrMinus = await User.getUserHighScore(req.user.username,"PlusOrMinus");



        Game.find({}, function(err, games) {
            //console.log(games);
           res.render('profile', {games: games,
            user:req.user, scoreJoueur:max});
        });

    } catch (error) {
        console.log(error)
    }
})()
 
 
});

router.put('/endGame', function(req, res){
  console.log("---- APPEL DE POST ----");
    var sc =req.body.score;
    var joueur = req.user.username;
    console.log("---- APPEL DE POST ----");
    console.log(sc);
    console.log(joueur);
  
    User.verifFinPartie(sc, joueur);
    console.log("---APRES VERIF -----");
    User.ajouterPartie(joueur, sc);
    console.log("----APRES AJOUT MONGO-----")


    res.end();
});

router.get('/PlusOrMinus', function (req, res, next) {
  res.render('PlusOrMinus', {username : req.user.username});
});


router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})
module.exports = router;