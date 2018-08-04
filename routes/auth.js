module.exports = function(app) {
const request = require ('request')
const Tokens = require('../models/tokens')
const crypto = require('crypto')
const configAuth = require('../config/auth')

	app.get('/auth/reddit', function(req, res){
		//if(req.user._id){
			req.session.state = crypto.randomBytes(32).toString('hex');
			res.redirect(configAuth.reddit.authorizeURL+req.session.state);
		//}
	});

	app.get('/auth/reddit/callback', function(req, res){
		
		if (req.query.state = req.session.state){
    		if(req.query.code){
    			Tokens.reddit(req.query.code)
    			res.redirect('http://localhost:8080/LinkAccounts')
    		}	
  		}
	});

	app.get('/auth/twitch', function(req, res){
		//if(req.user._id){
			req.session.state = crypto.randomBytes(32).toString('hex');
			res.redirect(configAuth.twitch.authorizeURL+req.session.state);
		//}
	});

	app.get('/auth/twitch/callback', function(req, res){
		
		if (req.query.state = req.session.state){
    		if(req.query.code){
          		Tokens.twitch(req.query.code)
    			res.redirect('http://localhost:8080/LinkAccounts') 
    		}		
  		}
	});

	app.get('/auth/twitter', function(req, res){
		//if(req.user._id){
		Tokens.twitterReq(function(err, data){
        res.redirect('https://api.twitter.com/oauth/authenticate?oauth_token='+data)
      });
       
		//}
	});

	app.get('/auth/twitter/callback', function(req, res){
    	Tokens.twitterAcs(req.query.oauth_token, req.query.oauth_verifier)
    	res.redirect('http://localhost:8080/LinkAccounts')   
	});   
}