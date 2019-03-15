var mongoose = require('mongoose')


var schema = mongoose.Schema;

var gameSchema = new schema({
        name:{
        type:String,
        required:true,
    },
    highscore: {
        type: String,
        required: true,
    },
})



module.exports = mongoose.model('games',gameSchema,'games');