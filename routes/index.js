var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

//On inclut nos deux schémas
var User = require('../db/User');
var Game = require('../db/Game');


/*
* Callback que l'on va passer à toutes nos requêtes quand on souhaite que l'utilisateur soit connecté
* (ie Authentifié)
*/
var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {// on passe à la suite si on est loggué
    next()
  } else {//sinon on redirige l'utilisateur sur la page de login
    res.redirect('/login')
  }
}

// Pour avoir la page d'acceuil
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


// Pour avoir la page de Login
router.get('/login', function (req, res, next) {
  res.render('login');
});


router.get('/signup', function (req, res, next) {
  res.render('signup');
});


router.get('/profile', loggedin, function (req, res, next) {

//on définit un objet max qui va contenir le highscore de chaque jeu 
var max={
  fakeJeu1: 0,
  fakeJeu2: 0,
  PlusOrMinus: 0,

};
(async () => {
    try {

        // on récupère tous les highscores en utilisant une méthodes asynchrone dans le modèle
        max.fakeJeu1 = await User.getUserHighScore(req.user.username,"fakeJeu1");
        max.fakeJeu2 = await User.getUserHighScore(req.user.username,"fakeJeu2");
        max.PlusOrMinus = await User.getUserHighScore(req.user.username,"PlusOrMinus");


        //On récupère toutes les informations du document Game grâce à la méthode du schéma, 
        // pour servir  la vue 
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

// Méthode appelé à la fin d'une partie de Plus ou Moins
router.put('/endGame',function(req, res){
    var sc =req.body.score; // On récupère le score dans le body de la requête (mis par le client PlusOrMinus.js)
    var joueur = req.user.username; // On récupère l'User
    console.log(sc);
    console.log(joueur);
  
    User.verifFinPartie(sc, joueur); // on fait des vérifications : nouveau highscore ? 
    console.log("---APRES VERIF -----");
    User.ajouterPartie(joueur, sc); // On ajoute la partie à la liste des parties du joueur
    console.log("----APRES AJOUT MONGO-----")


    res.end(); // Termine le processus de réponse 
});

// Pour avoir le jeu du Plus ou Moins
router.get('/PlusOrMinus', loggedin ,function (req, res, next) { // Reqête pour accéder au jeu
  res.render('PlusOrMinus', {username : req.user.username}); // on passe l'username dans la requête
});


// quand on demande à se déconnecter de sa session
router.get('/logout', function (req, res) {// requête pour se déconnecter
  req.logout() // méthode ajoutée par passport pour gérer les sessions
  res.redirect('/') // on redirige à l'entrée de l'application
})
module.exports = router;
