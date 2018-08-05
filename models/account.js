const dbfactory = require('../config/database.js')

const = schema = {
    
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    
    twitch           : {
        id           :{ type: String, defualt: null},
        access_token :{ type: String, defualt: null},
        refresh_token:{ type: String, defualt: null},  
        username     :{ type: String, defualt: null},
        logo         :{ type: String, defualt: null}        
        
    },
    twitter          : {
        id           :{ type: String, defualt: null},
        ouath_token  :{ type: String, defualt: null},
        ouath_secret :{ type: String, defualt: null},
        displayName  :{ type: String, defualt: null},
        logo         :{ type: String, defualt: null}
          
    },
    reddit           : {
        id           :{ type: String, defualt: null},
        access,token :{ type: String, defualt: null},
        refresh_token:{ type: String, defualt: null},
        username:    :{ type: String, defualt: null},
        logo         :{ type: String, defualt: null}
    }

}
const Accounts = dbfactory("Accounts", schema)

function addAccount(user_id) {
    let new_account = new Accounts({
        user: user_id
    })
    new_account.save();
},

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