var express = require('express');
var router = express.Router();
var User = require('../db/User');

/**
* Module recensant les routes et actions relatives à l'authentification.
*/


module.exports = function (passport) {


    // en cas de métode POST sur l'URL /signup, ie que l'utilisateur souhaite d'enregistrer
    router.post('/signup', function (req, res) { 
        

        // On récupère le nom d'utilisateur et le mot de passe dans le body de la requête
        var body = req.body,
            username = body.username,
            password = body.password;

            // On vérifie que tous les champs ont bien été renseignés
            if(username ==='' || password===''){
                res.status(500).send('Tous les champs doivent être renseignés');
            }


        // On cherche si l'username est déjà dans la base de donnée
        User.findOne({
            username: username
        }, function (err, doc) {
            if (err) { // en cas d'erreur coté BDD
                res.status(500).send('Une erreur s\'est produite')
            } else { 
                if (doc) {// on indique que l'utilisateur exite déjà si on en trouve un
                    res.status(500).send('Ce nom d\'utilisateur existe déjà')
                } else { //sinon on enregistre un nouvel utilisateur dans la BDD
                    var record = new User() // instance du schéma User
                    record.username = username;

                    //on chiffre le mot de passe
                    record.password = record.hashPassword(password)

                    // on crée des fausses partie de jeu, pour une cohérence des données 
                    // quand le joueur n'a pas encore jouée (pour l'affichage)
                    record.games = [{jeu:"fakeJeu1",date: new Date(), score:0 },
                            {jeu:"PlusOrMinus",date: new Date(), score:0 },
                            {jeu:"fakeJeu2",date: new Date(), score:0 }
                    ]


                    // on enregistre notre nouvel utilistaeur dans la BDD
                    record.save(function (err, user) {
                        if (err) {
                            res.status(500).send('Erreur coté BDD')
                        } else {// Si il n'y a pas eu d'erreur on redirige notre utilisateur vers
                                // la page de login
                            res.redirect('/login')
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