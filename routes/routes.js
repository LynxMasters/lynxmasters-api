module.exports = function(app, passport) {
const request = require ('request');
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            account : req.account
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // twitch -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/twitch', passport.authenticate('twitch', 
            { scope :
             ['user_read'] 
            }
         ));

        // handle the callback after twitch has authenticated the account
        app.get('/auth/twitch/callback',
            passport.authenticate('twitch', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the account
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // reddit ---------------------------------
        // need to add nounce for state param
        // send to reddit to do the authentication
        app.get('/auth/reddit',
            passport.authenticate('reddit', {
                state: 'fsdfdsafdffsa',
                duration: 'permanent',
                scope: 'identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,save,submit,subscribe,vote'
            }));

        // the callback after reddit has authenticated the account
        app.get('/auth/reddit/callback',
            passport.authenticate('reddit', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // twitch -------------------------------

        // send to twitch to do the authentication
        app.get('/connect/twitch', passport.authorize('twitch', { scope :'user_read' }));

        // handle the callback after twitch has authorized the account
        app.get('/connect/twitch/callback',
            passport.authorize('twitch', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the account
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // reddit ---------------------------------

        // send to reddit to do the authentication
        app.get('/connect/reddit', passport.authorize('reddit'));

        // the callback after reedit has authorized the account
        app.get('/connect/reddit/callback',
            passport.authorize('reddit', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink account. for social account, just remove the token
// for local account, remove email and password
// account account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var account            = req.account;
        account.local.email    = undefined;
        account.local.password = undefined;
        account.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitch -------------------------------
    app.get('/unlink/twitch', isLoggedIn, function(req, res) {
        var account            = req.account;
        account.twitch.token = undefined;
        account.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var account           = req.account;
        account.twitter.token = undefined;
        account.save(function(err) {
            res.redirect('/profile');
        });
    });

    // reddit ---------------------------------
    app.get('/unlink/reddit', isLoggedIn, function(req, res) {
        var account          = req.account;
        account.reddit.token = undefined;
        account.save(function(err) {
            res.redirect('/profile');
        });
    });
};
// route middleware to ensure account is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
