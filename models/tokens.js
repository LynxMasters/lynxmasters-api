const request = require('request')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const qs = require('qs')
let Accounts = require('./account')
let compareDT = require('../utils/time')


module.exports = {

    reddit: function (code, userId, err) {

        let data = 'grant_type=authorization_code&code=' + code + '&redirect_uri=http://localhost:8081/auth/reddit/callback&state='
        request({

            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic aDlOd1lVWkduNjVSSnc6dk9HSjFpdHZ5ZldIRV9aeGlBNWtZS0dXbC1R'//base64 encoded client_id:client_secret
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

        let data = 'client_id=b83413k7rg3fstv11tx5v7elta4t6l&client_secret=yj9xcmqdneuaz8kjwqsv6er1p0kxeq&code=' + code + '&grant_type=authorization_code&redirect_uri=http://localhost:8081/auth/twitch/callback'
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
                key: 'm9y0YNJfgwJafm5qKeMhu7xgC',
                secret: 'unSRzTB4KchtD1lb23zMn9xcWvErukoTtdjradDHp6YvGiND3g'
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
    redditRFSH: function (account) {
        if (compareDT.expired(account.reddit.expires)) {
            console.log('hitting function')
            return new Promise((resolve, reject) => {
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic aDlOd1lVWkduNjVSSnc6dk9HSjFpdHZ5ZldIRV9aeGlBNWtZS0dXbC1R',
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
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
        }
        else {
            return Promise.resolve(account)
        }

    },

    twitchRFSH: function (account) {
        if (compareDT.expired(account.twitch.expires)) {
            return new Promise((resolve, reject) => {
                console.log('hitting function')
                request({
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
                    },
                    url: 'https://id.twitch.tv/oauth2/token',
                    method: 'POST',
                    form: 'grant_type=refresh_token&refresh_token=' + account.twitch.refresh_token + '&client_id=b83413k7rg3fstv11tx5v7elta4t6l&client_secret=yj9xcmqdneuaz8kjwqsv6er1p0kxeq'
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
    },
} 