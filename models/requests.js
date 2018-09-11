const request = require('request')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const jwt = require('jsonwebtoken');
const Accounts = require('./account')
require('dotenv').config({path:'./.env'})
let redditID = process.env.REDDIT_CLIENT_ID
let redditSecret = process.env.REDDIT_CLIENT_SECRET
let redditCallback = process.env.REDDIT_CALLBACK
let twitchID = process.env.TWITCH_CLIENT_ID
let twitchSecret = process.env.TWITCH_CLIENT_SECRET
let twitchCallback = process.env.TWITCH_CALLBACK
let twitterID = process.env.TWITTER_CLIENT_ID
let twitterSecret = process.env.TWITTER_CLIENT_SECRET
let twitterCallback = process.env.TWITTER_CALLBACK


module.exports = {    

//*********************PROFILES**************************
    redditProfile: function (account, user_agent) {
        return new Promise((resolve, reject) => {
            if(account.reddit.linked){
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
            }else{
                let error = {
                    error: 'unlinked'
                }
                resolve(error)
            }
        })  
    },

    twitchProfile: function (account, user_agent) {
        
        return new Promise((resolve, reject) => {
            if(account.twitch.linked){
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
            }else{
                 let error = {
                    error: 'unlinked'
                }
                resolve(error)
            }
        })
    },

    twitterProfile: function(account){
        const oauth = OAuth({
            consumer: {
                key: twitterID,
                secret: twitterSecret
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
            if(account.twitter.linked){
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
            }else{
               let error = {
                    error: 'unlinked'
                }
                resolve(error)
            }   
        })
    },

//*********************FEEDS**************************
    redditFeed: function (account, user_agent) {
        return new Promise((resolve, reject) => {
            if(account.reddit.linked){
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
                    if(reddit.error) {
                        console.log('error reddit feed')
                        resolve(reddit)
                    } else {
                        resolve(reddit)
                    }
                })
            }else{
                let error = {
                    error: 'unlinked'
                }
                resolve(error)
            }
        })   
    },

    twitchFeed: function (account, user_agent) {
        return new Promise((resolve, reject) => {
            if(account.twitch.linked){
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Client_ID': 'b83413k7rg3fstv11tx5v7elta4t6l',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'    
                    },
                    url: 'https://api.twitch.tv/kraken/streams/followed?oauth_token='+account.twitch.access_token,
                    method: 'GET',

                }, function (err, res, body) {
                    let twitch = JSON.parse(body)
                    if (twitch.error) {
                        console.log('error twitch feed')
                        resolve(twitch)
                    } else {
                        resolve(twitch)
                    }
                })
            }else{
                let error = {
                    error: 'unlinked'
                }
                resolve(error)
            }
        })   
    },

    twitterFeed: function(account){
        const oauth = OAuth({
            consumer: {
                key: twitterID,
                secret: twitterSecret
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
            key: account.twitter.oauth_token,
            secret: account.twitter.oauth_secret
        }; 
                
        return new Promise(function(resolve, reject){
            if(account.twitter.linked){
                request({
                    method: request_data.method,
                    url: request_data.url,  
                    headers: oauth.toHeader(oauth.authorize(request_data, token))            
                }, function (err, res, body) {
                    
                    let twitter = JSON.parse(body)
                    if(twitter.error){
                        console.log('error twitch feed')
                        resolve(twitter)
                    }else{
                        resolve(twitter)  
                    }
                    
                })
            }else{
                let error = {
                    error: 'unlinked'
                }
                resolve(error)
            }    
        })
    },

    redditComments: function (account, id36) {
        return new Promise((resolve, reject) => {
            if(account.reddit.linked){
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Authorization': 'bearer '+account.reddit.access_token,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                    },
                    url: 'https://oauth.reddit.com/comments/'+id36,
                    method: 'GET',
                }, function (err, res, body) {
                    let reddit = JSON.parse(body)
                    if(reddit.error) {
                        console.log('error reddit feed')
                        resolve(reddit)
                    } else {
                        resolve(reddit)
                    }
                })
            }else{
                let error = {
                    error: 'unlinked'
                }
                resolve(error)
            }
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
                key: twitterID,
                secret: twitchSecret
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