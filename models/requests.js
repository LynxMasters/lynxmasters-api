const request = require('request')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const jwt = require('jsonwebtoken');
const Accounts = require('./account')


module.exports = {    

//*********************PROFILES**************************
    redditProfile: function (account, user_agent) {
        if(account.reddit.linked){
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
                    if(reddit.error) {
                        console.log('error reddit profile')
                        resolve(reddit)
                    } else {
                        resolve(reddit)
                    }
                })
            }) 
        }else{         
            return 'not linked'
        } 
    },

    twitchProfile: function (account, user_agent) {
        if(account.twitch.linked){
            return new Promise((resolve, reject) => {
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Authorization': 'Oauth '+account.twitch.access_token,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'    
                    },
                    url: 'https://api.twitch.tv/kraken/user?oauth_token='+account.twitch.access_token,
                    method: 'GET',
                }, function (err, res, body) {
                    let twitch = JSON.parse(body)
                    if (twitch.error) {
                        console.log('error twitch profile')
                        resolve(twitch)
                    } else {
                        resolve(twitch)
                    }
                })
            })
        }else{           
            return 'not linked'
        }  
    },

    twitterProfile: function(account){
        if(account.twitter.linked){
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
                url: 'https://api.twitter.com/1.1/users/show.json?screen_name='+account.twitter.displayName,
                method: 'GET'
            };
                    
            const token = {
                key: account.twitter.oauth_token,
                secret: account.twitter.oauth_secret
            }; 
                    
            return new Promise(function(resolve, reject){
                request({
                    method: request_data.method,
                    url: request_data.url,  
                    headers: oauth.toHeader(oauth.authorize(request_data, token))            
                }, function (err, res, body) {
                    let twitter = JSON.parse(body)
                    if(twitter.errors){
                        console.log('error twitter profile')
                        resolve(twitter.errors)
                    }else{  
                        resolve(twitter)
                    }
                })    
            })
        }else{           
            return 'not linked'
        } 
    },

//*********************FEEDS**************************
    redditFeed: function (account, user_agent) {
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Authorization': 'bearer '+account.reddit.access_token,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                },
                url: 'https://oauth.reddit.com/hot?show=all&limit=100',
                method: 'GET',
            }, function (err, res, body) {
                let reddit = JSON.parse(body)
                var result = {
                    account,
                    reddit
                }
                if(reddit.error) {
                    console.log('error reddit feed')
                    resolve(result)
                } else {
                    resolve(result)
                }
            })
        })    
    },

    twitchFeed: function (result, user_agent) {
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Client_ID': 'b83413k7rg3fstv11tx5v7elta4t6l',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'    
                },
                url: 'https://api.twitch.tv/kraken/streams/followed?oauth_token='+result.account.twitch.access_token,
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
                if (twitch.error) {
                    console.log('error twitch feed')
                    resolve(result2)
                } else {
                    resolve(result2)
                }
            })
        })    
    },

    twitterFeed: function(result){
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
            url: 'https://api.twitter.com/1.1/statuses/home_timeline.json?count=100',
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
                
                let twitter = JSON.parse(body)
                let account =result.account
                let reddit = result.reddit
                let twitch = result.twitch
                let result3 = {
                    reddit,
                    twitch,
                    twitter
                    }
                if(twitter.error){
                    console.log('error twitch feed')
                    resolve(result3)
                }else{
                    resolve(result3)  
                }
                
            })    
        })
    },

//*********************Friends**************************
    redditFriends: function (account, user_agent) {
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

    twitchFriends: function (result, user_agent) {
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

    twitterFriends: function(result){
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
            url: 'https://api.twitter.com/1.1/users/show.json?screen_name='+result.account.twitter.displayName,
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
                console.log(body)     
               
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
            })    
        })
    },
}    