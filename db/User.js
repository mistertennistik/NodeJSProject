var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

var Game = require('./Game');
var schema = mongoose.Schema;

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

userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password,hash) {
    return bcrypt.compareSync(password,hash)
}


userSchema.statics.test = function(id,res) {
  this.findById(id, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


userSchema.statics.getUserHighScore=  async function (joueur, jeu) {  
    return new Promise(async (resolve, reject) => {
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
                resolve(max);
            }else{// sinon...
                console.log("aucune partie de ce jeu jouée")
            }
            
        } catch (error) {
            reject(error)
        }
    })
};

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
            console.log("c'est la merde");
        }

    });



};






//enregistre une partie (jeu, date,score) pour un joueur
// pour une date new Date()
/* 
{
    date : new Date(),
    jeu : "PlusOrMinus",
    score : score
}

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

// récupère le highscore pour un jeu
/*userSchema.methods.highscore = function(jeu){

}*/

module.exports = mongoose.model('users',userSchema,'users');