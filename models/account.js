const dbfactory = require('../config/database.js')
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const schema = {
    
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    
    twitch           : {
        id           :{ type: String, default: null},
        access_token :{ type: String, default: null},
        refresh_token:{ type: String, default: null},
        username     :{ type: String, default: null},
        logo         :{ type: String, default: null}
        
    },
    twitter          : {
        id           :{ type: String, default: null},
        ouath_token  :{ type: String, default: null},
        ouath_secret :{ type: String, default: null},
        displayName  :{ type: String, default: null},
        logo         :{ type: String, default: null}
          
    },
    reddit           : {
        id           :{ type: String, default: null},
        access_token :{ type: String, default: null},
        refresh_token:{ type: String, default: null},
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
    Accounts.findOne({user: user_id}, function (error, user) {
      if (error) {
        reject(error)
      }

      accounts.reddit.id = data.id
      accounts.reddit.access_token = data.access_token
      accounts.reddit.refresh_token = data.refresh_token
      accounts.reddit.username = data.username
      accounts.reddit.logo = data.logo

      accounts.save(function (error) {
        if (error) {
          reject(error)
        }
        resolve(true)
      })
    })
  })
}

function updateAccountTwitch(user_id, data){
    return new Promise((resolve, reject) => {
        Accounts.findOne({user: user_id}, function (error, user) {
            if (error) {
                reject(error)
            }

            accounts.twitch.id = data.id
            accounts.twitch.access_token = data.access_token
            accounts.twitch.refresh_token = data.refresh_token
            accounts.twitch.username = data.username
            accounts.twitch.logo = data.logo

            accounts.save(function (error) {
            if (error) {
                reject(error)
            }
            resolve(true)
        })
    })
  })
}

function updateAccountTwitter(user_id, data){
  return new Promise((resolve, reject) => {
    Accounts.findOne({user: user_id}, function (error, user) {
      if (error) {
        reject(error)
      }

      accounts.twitter.id = data.id
      accounts.twitter.ouath_token = data.ouath_token
      accounts.twitter.ouath_secret = data.ouath_secret
      accounts.twitter.displayName = data.displayName
      accounts.twitter.logo = data.logo

      accounts.save(function (error) {
        if (error) {
          reject(error)
        }
        resolve(true)
      })
    })
  })
}

module.exports = {
 addAccount,
 updateAccountReddit,
 updateAccountTwitch,
 updateAccountTwitter
}