// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
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

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
