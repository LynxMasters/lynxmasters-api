module.exports = function(app) {
const request = require ('request')
const Tokens = require('../models/tokens')
const crypto = require('crypto')
const configAuth = require('../config/auth')
const jwt = require('jsonwebtoken');
let security = require('../utils/encryption-decryption')
let path = '/api/v1';
const Accounts = require('../models/account')
const OAuth = require('oauth-1.0a')
let compareDT = require('../utils/time')


	app.get('/auth/reddit', function(req, res){
		var jwt_token = req.query.token;
		jwt.verify(jwt_token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    		let decryptedID = security.decrypt(decoded.id)
    		console.log('------decryptedID------')
    		console.log(decryptedID)
    		req.session.state = crypto.randomBytes(32).toString('hex');
    		req.session.token = jwt_token
			res.redirect(configAuth.reddit.authorizeURL+req.session.state);
  		})
	});

	app.get('/auth/reddit/callback', function(req, res){
		console.log(req.session.token);
		jwt.verify(req.session.token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    		let decryptedID = security.decrypt(decoded.id)
    		console.log('------decryptedID------')
    		console.log(decryptedID)
			if (req.query.state == req.session.state){
    			if(req.query.code){
    				Tokens.reddit(req.query.code, decryptedID)
    				res.redirect('http://localhost:8080/LinkAccounts')
    			}	
  			}
  		})	  
	});

	app.get('/auth/twitch', function(req, res){
		var jwt_token = req.query.token;
		jwt.verify(jwt_token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    		let decryptedID = security.decrypt(decoded.id)
    		console.log('------decryptedID------')
    		console.log(decryptedID)
			req.session.state = crypto.randomBytes(32).toString('hex');
			req.session.token = jwt_token
			res.redirect(configAuth.twitch.authorizeURL+req.session.state);
		})
	});

	app.get('/auth/twitch/callback', function(req, res){
		console.log(req.session.token);
		jwt.verify(req.session.token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    		let decryptedID = security.decrypt(decoded.id)
    		console.log('------decryptedID------')
    		console.log(decryptedID)
			if (req.query.state == req.session.state){
    			if(req.query.code){
          			Tokens.twitch(req.query.code, decryptedID)
    				res.redirect('http://localhost:8080/LinkAccounts') 
    			}	
    		}
    	})			
	});

	app.get('/auth/twitter', function(req, res){
		var jwt_token = req.query.token;
		jwt.verify(jwt_token, configAuth.jwt.secret, function(err, decoded) {
    		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    		let decryptedID = security.decrypt(decoded.id)	
    		console.log('------decryptedID------')
    		console.log(decryptedID)
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
			let decryptedID = security.decrypt(decoded.id)	
			console.log('------decryptedID------')
    		console.log(decryptedID)
    		Tokens.twitterAcs(req.query.oauth_token, req.query.oauth_verifier, decryptedID )
    		res.redirect('http://localhost:8080/LinkAccounts')   
		})	
	});

    app.post(`${path}/accounts/`, (req, res) => {
        
        jwt.verify(req.body.headers.Authorization, configAuth.jwt.secret, function(error, decoded){
            if(error){
                res.send(error)
            }
            else{
            let decryptedID = security.decrypt(decoded.id)
                Accounts.fetchOne(decryptedID, function(error, accounts){
                    if(compareDT.expired(accounts.reddit.expires)){
                            Tokens.redditRFSH(accounts)
                    }
                    if(compareDT.expired(accounts.twitch.expires)){
                            Tokens.twitchRFSH(accounts)      
                    }
                }).then(accounts => Accounts.fetchOne(accounts.user))
                .then((accounts) =>{
                        res.send(accounts) 
                    },(err)=>{
                        reject(err)
                    }
                )
            }
        })
    });

    app.post(`${path}/redditGET/`, (req, res) => {
        
        jwt.verify(req.headers['authorization'], configAuth.jwt.secret, function(error, decoded){
            if(error){
                res.send(error)
            }
            else{

                let decryptedID = security.decrypt(decoded.id)
                return new Promise(function(resolve, reject){
                    request({
                
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded',
                            'Authorization': 'bearer '+req.body.data.access_token,
                            'User-Agent': req.body.data.user_agent
                        },
                        url: 'https://oauth.reddit.com/api/v1'+req.body.data.endpoint,
                        method: 'GET',
                    },function(err, res, body) {
                        if (err) return reject(err);
                        try {
                            resolve(JSON.parse(body));
                        } catch(e) {
                            reject(e);
                        }           
                    })
                }).then(
                    (body)=>{
                        res.send(body)
                    },(err)=>{
                        res.send(err)
                    }
                )     
            }
        })
    });
    
    app.post(`${path}/twitchGET/`, (req, res) => {
        
        jwt.verify(req.headers['authorization'].toString(), configAuth.jwt.secret, function(error, decoded){
            if(error){
                res.send(error)
            }
            else{

                let decryptedID = security.decrypt(decoded.id)
                return new Promise(function(resolve, reject){
                    request({
                
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded',
                            'Authorization': 'Oauth '+req.body.data.access_token,
                            'User-Agent': req.body.data.user_agent,    
                        },
                        url: 'https://api.twitch.tv/kraken'+req.body.data.endpoint,
                        method: 'GET',
                    },function(err, res, body) {
                        if (err) return reject(err);
                        try {
                            resolve(JSON.parse(body));
                        } catch(e) {
                            reject(e);
                        }              
                    })
                }).then(
                    (body)=>{
                        res.send(body)
                    },(err)=>{
                        res.send(err)
                    }
                )     
            }
        })
    });
        
    app.post(`${path}/twitterGET/`, (req, res) => {
       
        jwt.verify(req.headers['authorization'], configAuth.jwt.secret, function(error, decoded){
            if(error){
                res.send(error)
            }
            else{
                
                let decryptedID = security.decrypt(decoded.id)
                const oauth = OAuth({
                    consumer: {
                        key: 'm9y0YNJfgwJafm5qKeMhu7xgC',
                        secret: 'unSRzTB4KchtD1lb23zMn9xcWvErukoTtdjradDHp6YvGiND3g'
                    },
                    signature_method: 'HMAC-SHA1',
                    hash_function(base_string, key) {
                        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
                    }
                });
 
                const request_data = {
                    url: 'https://api.twitter.com/1.1'+req.body.data.endpoint,
                    method: 'GET'
                };
                
                const token = {
                    key: req.body.data.oauth_token,
                    secret: req.body.data.oauth_secret
                }; 
                
                return new Promise(function(resolve, reject){
                    request({
                        method: request_data.method,
                        url: request_data.url,  
                        headers: oauth.toHeader(oauth.authorize(request_data, token))
                        
                    },function(err, res, body) {
                        if (err) return reject(err);
                        
                        try {
                            resolve(JSON.parse(body));
                        } catch(e) {
                            reject(e);
                        }              
                    })
                }).then(
                    (body)=>{
                        res.send(body)
                    },(err)=>{
                        res.send(err)
                    }
                )     
            }
        })
    });

        app.post(`${path}/redditPOST/`, (req, res) => {
        console.log(req.body.data)
        jwt.verify(req.headers['authorization'], configAuth.jwt.secret, function(error, decoded){
            if(error){
                res.send(error)
            }
            else{
                console.log(decoded)
                let decryptedID = security.decrypt(decoded.id)
                console.log(decryptedID)
                return new Promise(function(resolve, reject){
                    request({
                
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded',
                            'Authorization': 'bearer '+req.body.data.access_token,
                            'User-Agent': req.body.data.user_agent 
                        },
                        url: 'https://oauth.reddit.com/api/v1'+req.body.data.endpoint,
                        method: 'POST',
                        form: req.body.data.params
                    },function(err, res, body) {
                        if (err) return reject(err);
                        try {
                            resolve(JSON.parse(body));
                        } catch(e) {
                            reject(e);
                        }           
                    })
                }).then(
                    (body)=>{
                        res.send(body)
                    },(err)=>{
                        res.send(err)
                    }
                )     
            }
        })
    });

    app.post(`${path}/twitchPOST/`, (req, res) => {
        console.log(req.body.data)
        jwt.verify(req.headers['authorization'].toString(), configAuth.jwt.secret, function(error, decoded){
            if(error){
                res.send(error)
            }
            else{
                console.log(decoded)
                let decryptedID = security.decrypt(decoded.id)
                console.log(decryptedID)
                return new Promise(function(resolve, reject){
                    request({
                
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded',
                            'Authorization': 'Oauth '+req.body.data.access_token,
                            'User-Agent': req.body.data.user_agent,
                        },
                        url: 'https://api.twitch.tv/kraken'+req.body.data.endpoint,
                        method: 'POST',
                        form: req.body.data.params
                    },function(err, res, body) {
                        if (err) return reject(err);
                        try {
                            resolve(JSON.parse(body));
                        } catch(e) {
                            reject(e);
                        }              
                    })
                }).then(
                    (body)=>{
                        res.send(body)
                    },(err)=>{
                        res.send(err)
                    }
                )     
            }
        })
    });

    app.post(`${path}/twitterPOST/`, (req, res) => {
        console.log(req.body)
        jwt.verify(req.headers['authorization'], configAuth.jwt.secret, function(error, decoded){
            if(error){
                res.send(error)
            }
            else{
                console.log(decoded)
                let decryptedID = security.decrypt(decoded.id)
                console.log(decryptedID)
                const oauth = OAuth({
                    consumer: {
                        key: 'm9y0YNJfgwJafm5qKeMhu7xgC',
                        secret: 'unSRzTB4KchtD1lb23zMn9xcWvErukoTtdjradDHp6YvGiND3g'
                    },
                    signature_method: 'HMAC-SHA1',
                    hash_function(base_string, key) {
                        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
                    }
                });
 
                const request_data = {
                    url: 'https://api.twitter.com/1.1'+req.body.data.endpoint,
                    method: 'POST',
                    form: req.body.data.params
                };
                console.log(req.body.data.oauth_secret)
                const token = {
                    key: req.body.data.oauth_token,
                    secret: req.body.data.oauth_secret
                }; 
                
                return new Promise(function(resolve, reject){
                    request({
                        method: request_data.method,
                        url: request_data.url,  
                        headers: oauth.toHeader(oauth.authorize(request_data, token))
                        
                    },function(err, res, body) {
                        if (err) return reject(err);
                        
                        try {
                            resolve(JSON.parse(body));
                        } catch(e) {
                            reject(e);
                        }              
                    })
                }).then(
                    (body)=>{
                        res.send(body)
                    },(err)=>{
                        res.send(err)
                    }
                )     
            }
        })
    });
}
