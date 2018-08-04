// load the things we need
var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
    local            : {
    }, 
    
    twitch         : {

        id           : String,
        access_token        : String,
        refresh_token       : String,   
        username            : String,
        logo                : String        
        
    },
    twitter          : {
        id           : String,
        ouath_token  : String,
        ouath_secret : String,
        displayName  : String,
        logo         : String,
          
    },
    reddit           : {
        id           : String,
        access,token : String,
        refresh_token: String,
        name         : String,
        logo         : String,
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Accounts', accountSchema);
