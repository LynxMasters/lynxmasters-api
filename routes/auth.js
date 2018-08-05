module.exports = function(app) {
const request = require ('request')
const Tokens = require('../models/tokens')
const crypto = require('crypto')
const configAuth = require('../config/auth')
const jwt = require('jsonwebtoken');


	app.get('/auth/reddit', function(req, res){
		var jwt_token = req.query.token;
		jwt.verify(jwt_token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    		console.log('---user._id-jwt-decoded-----')
    		console.log(decoded)
    		req.session.state = crypto.randomBytes(32).toString('hex');
    		req.session.token = jwt_token
			res.redirect(configAuth.reddit.authorizeURL+req.session.state);
  		})
	});

	app.get('/auth/reddit/callback', function(req, res){
		//jwt_token stored as a session var
		console.log(req.session.token);
		jwt.verify(req.session.token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
			if (req.query.state = req.session.state){
    			if(req.query.code){
    				Tokens.reddit(req.query.code)
    				res.redirect('http://localhost:8080/LinkAccounts')
    			}	
  			}
  		})	  
	});

	app.get('/auth/twitch', function(req, res){
		var jwt_token = req.query.token;
		jwt.verify(jwt_token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    		console.log('---user._id-jwt-decoded-----')
			console.log(decoded)
			req.session.state = crypto.randomBytes(32).toString('hex');
			req.session.token = jwt_token
			res.redirect(configAuth.twitch.authorizeURL+req.session.state);
		})
	});

	app.get('/auth/twitch/callback', function(req, res){
		console.log(req.session.token);
		jwt.verify(req.session.token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
			if (req.query.state = req.session.state){
    			if(req.query.code){
          			Tokens.twitch(req.query.code)
    				res.redirect('http://localhost:8080/LinkAccounts') 
    			}	
    		}
    	})			
	});

	app.get('/auth/twitter', function(req, res){
		var jwt_token = req.query.token;
		jwt.verify(jwt_token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    		console.log('---user._id-jwt-decoded-----')	
    		console.log(decoded)
    		req.session.token = jwt_token;
			Tokens.twitterReq(function(err, data){
        	res.redirect('https://api.twitter.com/oauth/authenticate?oauth_token='+data)
        	})
		})
	});

	app.get('/auth/twitter/callback', function(req, res){
    	console.log(req.session.token);
		jwt.verify(req.session.token, configAuth.jwt.secret, function(err, decoded) {
			if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    		Tokens.twitterAcs(req.query.oauth_token, req.query.oauth_verifier)
    		res.redirect('http://localhost:8080/LinkAccounts')   
		})	
	});   
}