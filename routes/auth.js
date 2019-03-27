var express = require('express');
var router = express.Router();
var User = require('../db/User');

/* GET home page. */


module.exports = function (passport) {
    router.post('/signup', function (req, res) { // à la reception d'un POST sur l'URL /signup
        var body = req.body, // on récupère l'username et le mot de passe dans le body de la requête
            username = body.username,
            password = body.password;

            if(username ==='' || password===''){ //Si l'un des champs est incomplet..
                res.status(500).send('Tous les champs doivent être renseignés')// .. on indique à l'utilisateur que tous les
                //champs doivent l'être.
                res.redirect('/signup')
            }
        User.findOne({ // on verifie que l'username de l'inscription n'existe pas
            username: username 
        }, function (err, doc) {
            if (err) {// en cas d'erreur coté BDD
                res.status(500).send('Une erreur s\'est produite')
            } else {
                if (doc) { // si il y a un resultat à la recherche
                    res.status(500).send('Ce nom d\'utilisateur existe déjà') // c'est que l'utilisateur existe déjà
                    // on l'indique donc à l'utilisateur.
                } else {
                    var record = new User() // on creer un objet User, issu du schema db/User
                    record.username = username;
                    record.password = record.hashPassword(password) // on hash le mot de passe avec la méthode indiqué dans le schéma
                    record.save(function (err, user) {// on enregistre l'username ainsi que le haché cryptographique du mot de passe
                        if (err) {// on indique si il y a une erreur côté BDD
                            res.status(500).send('Erreur coté BDD')
                        } else {
                            res.redirect('/login') // sinon on dirige l'utilisateur vers la page de login pour qu'il 
                            //puisse utiliser son compte fraîchement crééé.
                        }
                    })
                }
            }
        })
    });


    router.post('/login', passport.authenticate('local', { // en cas de POST sur /login
        failureRedirect: '/login', // on redirige sur la page de login si il y a problème d'authentification
        successRedirect: '/profile', // sinon on envoie une requet GET sur le profile
    }), function (req, res) {
        
        
    // Si cette fonction est appelée, l'authentification a réussi.
    // `req.user` contient l'utilisateur authentifié.   
        res.send('BONJOUR')
    })
    return router;
};
