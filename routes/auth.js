module.exports = function(app) {
const request = require ('request');
const crypto = require('crypto');
const hmacsha1 = require('hmacsha1');
const configAuth = require('../config/auth');


	app.get('/auth/reddit', function(req, res){
		//if(req.user._id){
			//req.session = crypto.randomBytes(32).toString('hex');
			res.redirect(configAuth.reddit.authorizeURL);
		//}
	});

	app.get('/auth/reddit/callback', function(req, res){
		//if (req.query.state == req.session){
    		if(req.query.code){
    			if(redditToken(req.query.code)){
    				res.redirect('http//localhost:8080/LinkAccounts')
    			}
    		}	
  		//}
	});

	app.get('/auth/twitch', function(req, res){
		//if(req.user._id){
			//req.session.state = crypto.randomBytes(32).toString('hex');
			res.redirect(configAuth.twitch.authorizeURL);
		//}
	});

	app.get('/auth/twitch/callback', function(req, res){
		//if (req.query.state == req.session.state){
    		if(req.query.code){
    			twitchToken(req.query.code);
    		}		
  		//}
	});

	app.get('/auth/twitter', function(req, res){
		//if(req.user._id){
			twitterToken();
		//}

	});
	app.get('/auth/twitch/callback', function(req, res){

	});

    
    function redditToken(code) {
    	
    	let data = 'grant_type=authorization_code&code='+code+'&redirect_uri=http://localhost:8081/auth/reddit/callback'
    	request({
    		headers: {
      			'Accept': 'application/x-www-form-urlencoded',
      			'Content-Type': 'application/x-www-form-urlencoded',
      			'Authorization': 'Basic aDlOd1lVWkduNjVSSnc6dk9HSjFpdHZ5ZldIRV9aeGlBNWtZS0dXbC1R'//base64 encoded client_id:client_secret 
    		},
    		uri: 'https://www.reddit.com/api/v1/access_token',
    		body: data,
    		method: 'POST'
  			}, function (err, res, body) {
  				let tknData = JSON.parse(body)
  				console.log(tknData.access_token)
  				if(tknData.access_token){
  					
  				}
  				else{
  					return(err);
  				}
  		});
    	if(err){
    		return false;
    	}
    	return true;
	}

	function twitchToken(code) {

    	let data = 'client_id=b83413k7rg3fstv11tx5v7elta4t6l&client_secret=yj9xcmqdneuaz8kjwqsv6er1p0kxeq&code='+code+'&grant_type=authorization_code&redirect_uri=http://localhost:8081/auth/twitch/callback'	
    	request({
    		headers: {
      			'Accept': 'application/x-www-form-urlencoded',
      			'Content-Type': 'application/x-www-form-urlencoded' 
    		},
    		uri: 'https://id.twitch.tv/oauth2/token',
    		body: data,
    		method: 'POST'
  			}, function (err, res, body) {
  				let tknData = JSON.parse(body)
  				console.log(tknData)
  				if(tknData.access_token){
  					
  				}
  				else{
  					return(err)
  				}
  			});
    	if(err){
    		return false;
    	}
    	return true;
	};
	

	function twitterToken(code) {
    	//1300228849
    	//1533299330218
    	let date = Math.floor(Date.now() / 1000);
    	let nounce = 'LYMT' + date * 100;
    	let prefix = "POST&"
    	let base = 'https://api.twitter.com/oauth/request_token&oauth_nonce='+nounce+'&oauth_callback==http://localhost:8081/auth/twitter/callback&oauth_signature_method=HMAC-SHA1&oauth_timestamp='+date+'&oauth_consumer_key=m9y0YNJfgwJafm5qKeMhu7xgC&oauth_version=1.0'
		let encodeBase = encodeURIComponent(base);
		let baseString = prefix + encodeBase;
		console.log(baseString)
		//let buf1 = crypto.createHmac("sha1", "0").update(baseString).digest();
		let key = 'm9y0YNJfgwJafm5qKeMhu7xgC&unSRzTB4KchtD1lb23zMn9xcWvErukoTtdjradDHp6YvGiND3g'
		//let singature = Buffer.concat([buf1, buf2]).toString('base64');
    	let singature = hmacsha1(key, baseString);
    	console.log(singature);
		let data = ''	
    	request({
    		headers: {
      			'Authorization': 'Oauth oauth_nonce='+nounce+', oauth_callback=http://localhost:8081/auth/twitter/callback, oauth_signature_method=HMAC-SHA1, oauth_timestamp='+date+', oauth_consumer_key=m9y0YNJfgwJafm5qKeMhu7xgC, oauth_signature='+singature+', oauth_version=1.0' 
    		},
    		uri: 'https://api.twitter.com/oauth/request_token',
    		body: data,
    		method: 'POST'
  			},function (err, res, body) {
  				let oauthData = JSON.parse(body)
  				console.log(oauthData)
  				if(oauthData.access_token){
  					
  				}
  			});
    };
}