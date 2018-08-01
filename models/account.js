// load the things we need
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    local            : {
        email        :String
    }, 
    
    twitch         : {

        id           : String,
        token        : String,
        username     : String,
        email        : String,
        logo         : String        
        
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String,
        logo         : String,
          
    },
    reddit           : {
        id           : String,
        token        : String,
        name         : String,
        logo         : String,
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema, 'account');
