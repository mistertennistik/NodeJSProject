/**
* Modèle. Il s'agit d'un schéma mongoose (API pour la gestion de la BDD
* MongoDB) 
*/

var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

var Game = require('./Game');
var schema = mongoose.Schema;



/**
* Schéma d'un joueur avec son nom d'utilisateur, son mot de passe (chiffré) et 
* une liste des parties qu'il a pu disputer.
*/

var userSchema = new schema({
    username:{
        type:String,
        required:true,
        unique : true, // on ne veut que le username soit unique
    },
    password: {
        type: String,
        required: true,
    },
    games: [{

        jeu : {type : String, required : true},
        date : {type : Date, default  : Date.now, required : true},
        score : {type : Number, required : true},

            }]

    
})

// méthode permettant d'hasher le mot de passe, avec un grain de sel (accentuant l'attaque par Rainbow Table)
userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

//méthode permettant de comparer deux mots de passe (un en clair, et l'autre hashé)
userSchema.methods.comparePassword = function (password,hash) {
    return bcrypt.compareSync(password,hash)
}



/**
* Méthode Statique du schéma User.
* Elle permet de récupérer dans la BDD le meilleur score du joueur pour un jeu.
*/
userSchema.statics.getUserHighScore=  async function (joueur, jeu) {  
    return new Promise(async (resolve, reject) => { // on utilise des promesses car opération asynchrone
        try {
            var max=0
            var aucunePartieJouee = true;
            const leJoueur = await this.findOne({username:joueur});
            var enJson = JSON.parse(JSON.stringify(leJoueur.games));
            for (var i = enJson.length - 1; i >= 0; i--) {
                
                //console.log(enJson[i].score)

                if(enJson[i].jeu ===jeu && enJson[i].score >= max){
                 aucunePartieJouee = false;
                 max = enJson[i].score;
                }
            }
            if(!aucunePartieJouee){// si le joueur a au moins joué une partie
                resolve(max);// on revoie la valeur
            }else{// sinon...
                console.log("aucune partie de ce jeu jouée")
            }
            
        } catch (error) {
            reject(error)
        }
    })
};


/**
* Méthode Statique du schéma User.
* Elle permet de mettre a jour le highscore d'un jeu si c'est nécéssaire.
*/
userSchema.statics.verifFinPartie = function(score, joueur){
    console.log("on est laaaaa");
    Game.findById("5c99dec7d907e85d3c8fa17f", function(err, jeu){
        let sc = parseInt(score, 10);
        let highscore  = parseInt(jeu.highscore, 10);
        if(err)
            console.log("---- ERROR ---- userSchema.verifFinPartie");
          //  res.send(err);
        if(sc > highscore){
            console.log("--- le score est > au highscore, On update");
            Game.findOneAndUpdate({_id: "5c99dec7d907e85d3c8fa17f"}, {$set: {highscore : score}}, function(err,doc){
                if (err){
                    console.log("erreur lors de l'update")
                }
                else{
                    console.log("update successful")
                }
            });
        }else{
            console.log("Pas d'update");
        }

    });



};




/**
* Méthode Statique du schéma User.
* Elle permet d'ajouter une partie à la liste des partie d'un joueur.
*/
userSchema.statics.ajouterPartie = function(joueur,score){
    this.findOneAndUpdate({username: joueur}, {$push: { games: { date : new Date(),
    jeu : "PlusOrMinus",
    score : score }}}, function(err,doc){
                if (err){
                    console.log("erreur lors de l'ajout de la partie")
                }
                else{
                    console.log("add successful")
                }
            });


}


module.exports = mongoose.model('users',userSchema,'users');