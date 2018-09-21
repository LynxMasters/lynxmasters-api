const request = require('request')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const jwt = require('jsonwebtoken');
const Accounts = require('./account')
require('dotenv').config({path:'./.env'})
let twitterID = process.env.TWITTER_CLIENT_ID
let twitterSecret = process.env.TWITTER_CLIENT_SECRET



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
                    url: 'https://oauth.reddit.com/hot?show=all&limit=25',
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

    redditFeedMore: function (account, id36) {
        return new Promise((resolve, reject) => {
            if(account.reddit.linked){
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Authorization': 'bearer '+account.reddit.access_token,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                    },
                    url: 'https://oauth.reddit.com/hot?show=all&limit=25&after='+id36,
                    method: 'GET',
                }, function (err, res, body) {
                    let reddit = JSON.parse(body)
                    console.log(reddit)
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
            url: 'https://api.twitter.com/1.1/statuses/home_timeline.json?count=25',
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

    twitterFeedMore: function(account){
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
            url: 'https://api.twitter.com/1.1/statuses/home_timeline.json?count=25',
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
//*********************POSTS**************************
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


    redditVotes: function (account, vote) {
        console.log('RedditVotes')
        console.log(vote)
        let data = 'id='+vote.id+'&dir='+vote.dir
        return new Promise((resolve, reject) => {
         if(account.reddit.linked){
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Authorization': 'bearer '+account.reddit.access_token,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                    },
                    url: 'https://oauth.reddit.com/api/vote/',
                    method: 'POST',
                    body: data
                }, function (err, res, body) {
                    let reddit = JSON.parse(body)
                    if(reddit.error) {
                        console.log('error reddit votes')
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

    redditComment: function (account, comment) {
        console.log('RedditComments')
        let data = 'api_type=json&text='+comment.text+'&thing_id='+comment.id
        return new Promise((resolve, reject) => {
         if(account.reddit.linked){
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Authorization': 'bearer '+account.reddit.access_token,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                    },
                    url: 'https://oauth.reddit.com/api/comment/',
                    method: 'POST',
                    body: data
                }, function (err, res, body) {
                    let reddit = JSON.parse(body)
                    if(reddit.error) {
                        console.log('error reddit comments')
                        resolve(reddit.error)
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

    twitterFavorite: function(account, favorite){
        let endpoint = null
        if(favorite.favorited){
            endpoint = "https://api.twitter.com/1.1/favorites/create.json?id="+favorite.id

        }else{
            endpoint = "https://api.twitter.com/1.1/favorites/destroy.json?id="+favorite.id
        }
        console.log(endpoint)
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
            url: endpoint,
            method: 'POST'
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
                    console.log(twitter)
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

    twitterRetweet: function(account, retweet){
        let endpoint = null
        if(retweet.retweeted){
            endpoint = "https://api.twitter.com/1.1/statuses/retweet/"+retweet.id+".json"

        }else{
            endpoint = "https://api.twitter.com/1.1/statuses/unretweet/"+retweet.id+".json"
        }
        console.log(endpoint)
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
            url: endpoint,
            method: 'POST'
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
                    console.log(twitter)
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
}    