const request = require('request')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const qs = require('qs')
require('dotenv').config({path:'./.env'})
let Accounts = require('./account')
let compareDT = require('../utils/time')
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

    reddit: function (code, userId, err) {
        let auth = Buffer.from(redditID+':'+redditSecret).toString('base64')
        console.log(auth)
        let data = 'grant_type=authorization_code&code=' + code + '&redirect_uri='+redditCallback+'&state='
        request({

            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic '+auth//base64 encoded client_id:client_secret
            },

            uri: 'https://www.reddit.com/api/v1/access_token',
            body: data,
            method: 'POST'

        }, function (err, res, body) {

            let tknData = JSON.parse(body)
            console.log('-----------Reddit access_token---------------')
            console.log(tknData)

            if (tknData) {
                // return(true)
                return new Promise((resolve, reject) => {
                    Accounts.updateAccountReddit(userId, tknData).then(
                        (account) => {
                            console.log("hitting account")
                            console.log(account)
                            resolve(true)
                        },
                        (err) => {
                            console.log("got rejected")
                            reject(err)
                        }
                    )
                })

            }
        });
    },

    twitch: function (code, userId, err) {

        let data = 'client_id='+twitchID+'&client_secret='+twitchSecret+'&code=' + code + '&grant_type=authorization_code&redirect_uri='+twitchCallback
        console.log(data)
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
            console.log('-----------Twitch access_token---------------')
            console.log(tknData)
            if (tknData) {
                // return(true)
                return new Promise((resolve, reject) => {
                    Accounts.updateAccountTwitch(userId, tknData).then(
                        (account) => {
                            console.log("hitting account")
                            console.log(account)
                            resolve(true)
                        },
                        (err) => {
                            console.log("got rejected")
                            reject(err)
                        }
                    )
                })
            }
        });
    },

    twitterReq: function (tkn) {
        console.log(twitterID)
        console.log(twitterSecret)
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
            url: 'https://api.twitter.com/oauth/request_token',
            method: 'POST',
            data: ''
        };

        const token = {
            key: '',
            secret: ''
        };

        request({

            url: request_data.url,
            method: request_data.method,
            form: oauth.authorize(request_data)

        }, function (err, res, body) {

            tknData = qs.parse(body);
            result = tknData.oauth_token;

            if (!err) {
                console.log(result + 'oauthTKN');
                return tkn(null, result);
            }
            else {
                return tkn(err, null)
            }
        });
    },

    twitterAcs: function (tkn, verify, userId) {

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

        const token = {
            key: tkn,
            secret: ''
        };

        const request_data = {
            url: 'https://api.twitter.com/oauth/access_token',
            method: 'POST',
            data: {oauth_verifier: verify}
        };

        request({

            url: request_data.url,
            method: request_data.method,
            form: oauth.authorize(request_data, token)

        }, function (err, res, body) {

            tknData = qs.parse(body);
            console.log('-----------Twitter access_token---------------');
            console.log(tknData);
            if (tknData) {
                // return(true)
                return new Promise((resolve, reject) => {
                    Accounts.updateAccountTwitter(userId, tknData).then(
                        (account) => {
                            console.log("hitting account")
                            console.log(account)
                            resolve(true)
                        },
                        (err) => {
                            console.log("got rejected")
                            reject(err)
                        }
                    )
                })
            }
        })
    },

    redditRFSH: function (account, user_agent) {
        let auth = Buffer.from(redditID+':'+redditSecret).toString('base64')
        if(account.reddit.linked){
            if (compareDT.expired(account.reddit.expires) != false) {
                return new Promise((resolve, reject) => {
                    request({
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic '+auth,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                        },
                        url: 'https://www.reddit.com/api/v1/access_token',
                        method: 'POST',
                        form: 'grant_type=refresh_token&refresh_token=' + account.reddit.refresh_token
                    }, function (err, res, body) {
                        let tknData = JSON.parse(body)
                        if (tknData.access_token == '') {
                            console.log('error')
                            console.log(tknData)
                            resolve(err)
                        } else {
                            console.log('true')
                            tknData['refresh_token'] = account.reddit.refresh_token

                            Accounts.updateAccountReddit(account.user, tknData).then(
                                (account) => {
                                    console.log("hitting account")
                                    console.log(account)
                                    resolve(account)
                                },
                                (err) => {
                                    console.log("got rejected")
                                    reject(err)
                                }
                            )
                        }
                    })
                })
            }else {
                return Promise.resolve(account)
            }
        }else{
            return account
        }
    },

    twitchRFSH: function (account, user_agent) {
        if(account.twitch.linked){
            if(compareDT.expired(account.twitch.expires) != false) {
                return new Promise((resolve, reject) => {
                    request({
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                        },
                        url: 'https://id.twitch.tv/oauth2/token',
                        method: 'POST',
                        form: 'grant_type=refresh_token&refresh_token=' + account.twitch.refresh_token + '&client_id='+twitchID+'&client_secret='+twitchSecret
                    }, function (err, res, body) {

                        let tknData = JSON.parse(body)
                        if (tknData.access_token == '') {
                            console.log('error')
                            console.log(tknData)
                            reject(err)
                        } else {
                            console.log('true')
                            console.log(tknData)
                            Accounts.updateAccountTwitch(account.user, tknData).then(
                                (account) => {
                                    console.log("hitting account")
                                    console.log(account)
                                    resolve(account)
                                },
                                (err) => {
                                    console.log("got rejected")
                                    reject(err)
                                }
                            )
                        }
                    })
                })
            } else {
                return Promise.resolve(account)
            }
        }else{
            return account
        }
    },

    redditRVK: function (account, user_agent) {
        console.log(compareDT.expired(account.reddit.expires))
        if (compareDT.expired(account.reddit.expires) != false) {
            console.log('hitting function')
            return new Promise((resolve, reject) => {
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0.'
                    },
                    url: 'https://www.reddit.com/api/v1/revoke_token',
                    method: 'POST',
                    form: 'token='+account.reddit.access_token+'&token_type_hint=bearer'
                }, function (err, res, body) {
                    let tknData = JSON.parse(body)
                    if (tknData.access_token == '') {
                        console.log('error')
                        console.log(tknData)
                        resolve(err)
                    } else {
                        console.log('true')
                        tknData['refresh_token'] = account.reddit.refresh_token

                        Accounts.updateAccountReddit(account.user, tknData).then(
                            (account) => {
                                console.log("hitting account")
                                console.log(account)
                                resolve(account)
                            },
                            (err) => {
                                console.log("got rejected")
                                reject(err)
                            }
                        )
                    }
                })
            })
        }else {
            return Promise.resolve(account)
        }
    },
}
