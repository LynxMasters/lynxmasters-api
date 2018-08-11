const request = require('request')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const jwt = require('jsonwebtoken');


module.exports = {    

    redditProfile: function (account, user_agent) {
        console.log('RedditProfile')
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Authorization': 'bearer '+account.reddit.access_token,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                },
                url: 'https://oauth.reddit.com/api/v1/me',
                method: 'GET',
            }, function (err, res, body) {
                let reddit = JSON.parse(body)
                var result = {
                    account,
                    reddit
                }
                if(reddit == '') {
                    console.log('error')
                    console.log(reddit)
                    reject(err)
                } else {
                    console.log('true')
                    resolve(result)
                }
            })
        })    
    },

    twitchProfile: function (result, user_agent) {
        console.log('TwitchProfile')
        console.log(result)
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Authorization': 'Oauth '+result.account.twitch.access_token,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'    
                },
                url: 'https://api.twitch.tv/kraken/user?oauth_token='+result.account.twitch.access_token,
                method: 'GET',
            }, function (err, res, body) {
                let twitch = JSON.parse(body)
                let account = result.account
                let reddit = result.reddit
                let result2 = {
                    account,
                    reddit,
                    twitch
                    
                }
                if (twitch == '') {
                    console.log('error')
                    console.log(twitch)
                    reject(err)
                } else {
                    console.log('true')
                    resolve(result2)
                }
            })
        })    
    },

    twitterProfile: function(result){
        console.log(result)
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
            url: 'https://api.twitter.com/1.1/users/show?screen_name='+result.account.twitter.displayName,
            method: 'GET'
        };
                
        const token = {
            key: result.account.twitter.oauth_token,
            secret: result.account.twitter.oauth_secret
        }; 
                
        return new Promise(function(resolve, reject){
            request({
                method: request_data.method,
                url: request_data.url,  
                headers: oauth.toHeader(oauth.authorize(request_data, token))            
            }, function (err, res, body) {
                
                 if (err) return reject(err);
                        
                try {
                    let twitter = JSON.parse(body)
                    let account = result.account
                    let reddit = result.reddit
                    let twitch = result.twitch
                    let result3 = {
                    reddit,
                    twitch,
                    twitter
                }
                    resolve(result3)
                } catch(e) {
                    reject(e);
                        } 
            })    
        })
    },
}    