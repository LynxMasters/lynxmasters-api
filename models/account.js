const dbfactory = require('../config/database.js')
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const schema = {
    
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    
    twitch           : {
        client_id    :{ type: String, default: null},
        access_token :{ type: String, default: null},
        refresh_token:{ type: String, default: null},
        expires      :{ type: String, default: null},
        username     :{ type: String, default: null},
        logo         :{ type: String, default: null}
        
    },
    twitter          : {
        user_id      :{ type: String, default: null},
        oauth_token  :{ type: String, default: null},
        oauth_secret :{ type: String, default: null},
        displayName  :{ type: String, default: null},
        logo         :{ type: String, default: null}
          
    },
    reddit           : {
        id           :{ type: String, default: null},
        access_token :{ type: String, default: null},
        refresh_token:{ type: String, default: null},
        expires      :{ type: String, default: null},
        username     :{ type: String, default: null},
        logo         :{ type: String, default: null}
    }
}


const Accounts = dbfactory("Accounts", schema)

function addAccount(user_id) {
    let new_account = new Accounts({
        user: user_id
    })
    return new Promise((resolve, reject) => {
        new_account.save((error, account) => {
            if (error) {
                reject(error)
            }
            resolve({
                account: account,
                success: true,
                message: 'Account DB was created successfully!'
            })
        })
    })
}

function updateAccountReddit(user_id, data){
  return new Promise((resolve, reject) => {
    Accounts.findOne({user: user_id}, function (error, accounts) {
      if (error) {
        reject(error)
      }
      let expires = new Date()
      expires.setSeconds(data.expires_in)
      console.log(expires)    
      accounts.reddit.id = data.id
      accounts.reddit.access_token = data.access_token
      accounts.reddit.refresh_token = data.refresh_token
      accounts.reddit.expires = expires.valueOf()
      accounts.reddit.username = data.username
      accounts.reddit.logo = data.logo

      accounts.save(function (error, accounts) {
        if (error) {
          reject(error)
        }
        resolve(accounts)
      })
    })
  })
}

function updateAccountTwitch(user_id, data){
    return new Promise((resolve, reject) => {
        Accounts.findOne({user: user_id}, function (error, accounts) {
            if (error) {
                reject(error)
            }
            let expires = new Date()
            expires.setSeconds(data.expires_in)
            console.log(expires)
            accounts.twitch.client_id = data._id
            accounts.twitch.access_token = data.access_token
            accounts.twitch.refresh_token = data.refresh_token
            accounts.twitch.expires = expires.valueOf()
            accounts.twitch.username = data.username
            accounts.twitch.logo = data.logo

            accounts.save(function (error) {
            if (error) {
                reject(error)
            }
            resolve(accounts)
        })
    })
  })
}

function updateAccountTwitter(user_id, data){
  return new Promise((resolve, reject) => {
    Accounts.findOne({user: user_id}, function (error, accounts) {
      if (error) {
        reject(error)
      }

      accounts.twitter.user_id = data.user_id
      accounts.twitter.oauth_token = data.oauth_token
      accounts.twitter.oauth_secret = data.oauth_token_secret
      accounts.twitter.displayName = data.screen_name
      accounts.twitter.logo = data.logo

      accounts.save(function (error) {
        if (error) {
          reject(error)
        }
          resolve(accounts)
      })
    })
  })
}

function deleteAccountTwitter(user_id){
  return new Promise((resolve, reject) => {
    Accounts.findOne({user: user_id}, function (error, accounts) {
      if (error) {
        reject(error)
      }

      accounts.twitter.user_id = ''
      accounts.twitter.oauth_token = ''
      accounts.twitter.oauth_secret = ''
      accounts.twitter.displayName = ''
      accounts.twitter.logo = ''

      accounts.save(function (error) {
        if (error) {
          reject(error)
        }
          resolve(accounts)
      })
    })
  })
}

function deleteAccountReddit(user_id){
  return new Promise((resolve, reject) => {
    Accounts.findOne({user: user_id}, function (error, accounts) {
      if (error) {
        reject(error)
      }

      accounts.reddit.user_id = ''
      accounts.reddit.oauth_token = ''
      accounts.reddit.oauth_secret = ''
      accounts.reddit.displayName = ''
      accounts.reddit.logo = ''

      accounts.save(function (error) {
        if (error) {
          reject(error)
        }
          resolve(accounts)
      })
    })
  })
}

function deleteAccountTwitch(user_id){
  return new Promise((resolve, reject) => {
    Accounts.findOne({user: user_id}, function (error, accounts) {
      if (error) {
        reject(error)
      }

      accounts.twitch.user_id = ''
      accounts.twitch.oauth_token = ''
      accounts.twitch.oauth_secret = ''
      accounts.twitch.displayName = ''
      accounts.twitch.logo = ''

      accounts.save(function (error) {
        if (error) {
          reject(error)
        }
          resolve(accounts)
      })
    })
  })
}

function fetchOne(user_id){
  return new Promise((resolve, reject) => {
    Accounts.findOne({user: user_id}, function(error, accounts){
      if(error){
        reject(error)
      }
      resolve(accounts)
    })
  })
}

module.exports = {
 addAccount,
 updateAccountReddit,
 updateAccountTwitch,
 updateAccountTwitter,
 fetchOne
}