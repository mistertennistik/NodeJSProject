var express = require('express');
var router = express.Router();
var User = require('../db/User');

/* GET home page. */


module.exports = function (passport) {
    router.post('/signup', function (req, res) {
        var body = req.body,
            username = body.username,
            password = body.password;

            if(username ==='' || password===''){
                res.status(500).send('Tous les champs doivent être renseignés')
                res.redirect('/signup')
            }
        User.findOne({
            username: username
        }, function (err, doc) {
            if (err) {
                res.status(500).send('Une erreur s\'est produite')
            } else {
                if (doc) {
                    res.status(500).send('Ce nom d\'utilisateur existe déjà')
                } else {
                    var record = new User()
                    record.username = username;
                    record.password = record.hashPassword(password)
                    record.save(function (err, user) {
                        if (err) {
                            res.status(500).send('Erreur coté BDD')
                        } else {
                            res.redirect('/login')
                        }
                    })
                }
            }
        })
    });


    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile',
    }), function (req, res) {
        res.send('BONJOUR')
    })
    return router;
};