// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var TwitchStrategy   = require('passport-twitch').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var RedditStrategy   = require('passport-reddit').Strategy;

// load up the account model
var Account       = require('../models/account');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize accounts out of session

    // used to serialize the account for the session
    passport.serializeUser(function(account, done) {
        done(null, account.id);
    });

    // used to deserialize the account
    passport.deserializeUser(function(id, done) {
        Account.findById(id, function(err, account) {
            done(err, account);
        });
    });
    // =========================================================================
    // Twitch ================================================================
    // =========================================================================
    var thStrategy = configAuth.twitchAuth;
    thStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a account is logged in or not)
    passport.use(new TwitchStrategy(thStrategy,
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
            console.log("=============twitch==============",profile);
            console.log(token, refreshToken);
            // check if the account is already logged in
            if (!req.account) {

                Account.findOne({ 'twitch.id' : profile.id }, function(err, account) {
                    if (err)
                        return done(err);

                    if (account) {

                        // if there is a account id already but no token (account was linked at one point and then removed)
                        if (!account.twitch.token) {
                            account.twitch.token = token;
                        
                            account.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, account);
                            });
                        }

                        return done(null, account); // account found, return that account
                    } else {
                        // if there is no account, create them
                        var newAccount            = new Account();

                        newAccount.twitch.id    = profile.id;
                        newAccount.twitch.token = token;
                        newAccount.twitch.username  = profile.username;
                        newAccount.twitch.email = profile.email;
                        newAccount.twitch.logo = profile._json.logo;
                        newAccount.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newAccount);
                        });
                    }
                });

            } else {
                // account already exists and is logged in, we have to link accounts
                var account            = req.account; // pull the account out of the session

                account.twitch.id    = profile.id;
                account.twitch.token = token;
                account.twitch.username = profile.username;
                account.twitch.email = profile.email;
                account.twitch.logo = profile._json.logo;
                account.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, account);
                });

            }
        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a account is logged in or not)

    },
    function(req, token, tokenSecret, profile, done) {

        // asynchronous
        process.nextTick(function() {
            console.log("=============twitter==============",profile);
            console.log(token, tokenSecret);
            // check if the account is already logged in
            if (!req.account) {

                Account.findOne({ 'twitter.id' : profile.id }, function(err, account) {
                    if (err)
                        return done(err);

                    if (account) {
                        // if there is a account id already but no token (account was linked at one point and then removed)
                        if (!account.twitter.token) {
                            account.twitter.token       = token;
                            account.twitter.username    = profile.username;
                            account.twitter.displayName = profile.displayName;
                            account.twitter.logo        = profile.photos[0].value;

                            account.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, account);
                            });
                        }

                        return done(null, account); // account found, return that account
                    } else {
                        // if there is no account, create them
                        var newAccount                 = new Account();

                        newAccount.twitter.id          = profile.id;
                        newAccount.twitter.token       = token;
                        newAccount.twitter.username    = profile.username;
                        newAccount.twitter.displayName = profile.displayName;
                        newAccount.twitter.logo        = profile.photos[0].value;    

                        newAccount.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newAccount);
                        });
                    }
                });

            } else {
                // account already exists and is logged in, we have to link accounts
                var account                 = req.account; // pull the account out of the session

                account.twitter.id          = profile.id;
                account.twitter.token       = token;
                account.twitter.username    = profile.username;
                account.twitter.displayName = profile.displayName;
                account.twitter.logo        = profile.photos[0].value;

                account.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, account);
                });
            }

        });

    }));

    // =========================================================================
    // REDDIT ==================================================================
    // =========================================================================
    passport.use(new RedditStrategy({

        clientID        : configAuth.redditAuth.clientID,
        clientSecret    : configAuth.redditAuth.clientSecret,
        callbackURL     : configAuth.redditAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a account is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        console.log("=============reddit==============",profile);
        console.log(token, refreshToken);
        // asynchronous
        process.nextTick(function() {

            // check if the account is already logged in
            if (!req.account) {

                Account.findOne({ 'reddit.id' : profile.id }, function(err, account) {
                    if (err)
                        return done(err);

                    if (account) {

                        // if there is a account id already but no token (account was linked at one point and then removed)
                        if (!account.reddit.token) {
                            account.reddit.id = profile.id;
                            account.reddit.token = token;
                            account.reddit.name  = profile.name;
                            account.reddit.logo  = profile._json.icon_img;


                            account.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, account);
                            });
                        }

                        return done(null, account);
                    } else {
                        var newAccount          = new Account();

                        newAccount.reddit.id    = profile.id;
                        newAccount.reddit.token = token;
                        newAccount.reddit.name  = profile.name;
                        newAccount.reddit.logo  = profile._json.icon_img;

                        newAccount.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newAccount);
                        });
                    }
                });

            } else {
                // account already exists and is logged in, we have to link accounts
                var account               = req.account; // pull the account out of the session

                account.reddit.id    = profile.id;
                account.reddit.token = token;
                account.reddit.name  = profile.name;
                account.reddit.logo  = profile._json.icon_img;

                account.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, account);
                });

            }

        });

    }));

};
