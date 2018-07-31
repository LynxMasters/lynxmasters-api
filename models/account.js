// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var accountSchema = mongoose.Schema({

    local            : {
        id           : String,
        username     : String  
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
        logo         : String   
    },
    reddit           : {
        id           : String,
        token        : String,
        name         : String,
        logo         : String

    }

});

// create the model for account and expose it to our app
module.exports = mongoose.model('Account', accountSchema, 'account');
