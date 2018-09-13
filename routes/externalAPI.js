module.exports = function(app) {
const request = require ('request')
const Tokens = require('../models/tokens')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
let security = require('../utils/encryption-decryption')
let path = '/api/v1';
const Accounts = require('../models/account')
let Users = require("../models/users")
const Request = require('../models/requests')
const OAuth = require('oauth-1.0a')
require('dotenv').config({path:'./.env'})
let link = process.env.REDIRECT
let redditAUTH = process.env.REDDIT_AUTHORIZE
let twitchAUTH = process.env.TWITCH_AUTHORIZE
let secret = process.env.JWT

  app.get(`${path}/auth/reddit`, function(req, res) {
    let decryptedToken = security.decrypt(req.query.token)
    jwt.verify(decryptedToken, secret, function(err, decoded) {
      if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
      req.session.state = crypto.randomBytes(32).toString('hex');
      req.session.token = decryptedToken
      res.redirect(redditAUTH + req.session.state);
    })
  });

  app.get(`${path}/auth/reddit/callback`, function(req, res) {
    jwt.verify(req.session.token, secret, function(err, decoded) {
      if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
      if (req.query.state == req.session.state) {
        if (req.query.code) {
          Tokens.reddit(req.query.code, decoded.id)
          req.session.token.destroy
          res.redirect(link)
        }
      }
    })
  });

  app.get(`${path}/auth/twitch`, function(req, res) {
    let decryptedToken = security.decrypt(req.query.token)
    jwt.verify(decryptedToken, secret, function(err, decoded) {
      if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
      req.session.state = crypto.randomBytes(32).toString('hex');
      req.session.token = decryptedToken
      res.redirect(twitchAUTH + req.session.state);
    })
  });

  app.get(`${path}/auth/twitch/callback`, function(req, res) {
    jwt.verify(req.session.token, secret, function(err, decoded) {
      if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
      if (req.query.state == req.session.state) {
        if (req.query.code) {
          Tokens.twitch(req.query.code, decoded.id)
          req.session.token.destroy
          res.redirect(link)
        }
      }
    })
  });

  app.get(`${path}/auth/twitter`, function(req, res) {
    let decryptedToken = security.decrypt(req.query.token)
    jwt.verify(decryptedToken, secret, function(err, decoded) {
      if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      })
      req.session.token = decryptedToken;
      Tokens.twitterReq(function(err, data) {
        res.redirect('https://api.twitter.com/oauth/authenticate?force_login=true&oauth_token=' + data)
      })
    })
  });

  app.get(`${path}/auth/twitter/callback`, function(req, res) {
    console.log(req.session.token);
    jwt.verify(req.session.token, secret, function(err, decoded) {
      if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      })
      Tokens.twitterAcs(req.query.oauth_token, req.query.oauth_verifier, decoded.id)
      req.session.token.destroy
      res.redirect(link)
    })
  });

  app.get(`${path}/accounts/`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Tokens.redditRFSH(result)
          })
          .then(result => {
            return Tokens.twitchRFSH(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/profiles/`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.redditProfile(result)
          })
          .then(result => {
            return Request.twitchProfile(result)
          })
          .then(result => {
            return Request.twitterProfile(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

    app.get(`${path}/profiles/reddit`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.redditProfile(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/profiles/twitch`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.twitchProfile(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/profiles/twitter`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.twitterProfile(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/feeds/reddit`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.redditFeed(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/feeds/twitch`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.twitchFeed(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/feeds/twitter`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.twitterFeed(result)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/comments/reddit`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.redditComments(result, req.query.id36)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.post(`${path}/unlink/twitter/`, (req, res) => {

    let decryptedToken = security.decrypt(req.body.headers.Authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        console.log(decoded.id)
        Accounts.deleteAccountTwitter(decoded.id)
          .then((result) => {
            res.send(result)
          }, (err) => {
            res.send(err)
          })
      }
    })
  });

  app.post(`${path}/unlink/reddit/`, (req, res) => {

    let decryptedToken = security.decrypt(req.body.headers.Authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.deleteAccountReddit(decoded.id)
          .then((result) => {
            res.send(result)
          }, (err) => {
            res.send(err)
          })
      }
    })
  });

  app.post(`${path}/unlink/twitch/`, (req, res) => {

    let decryptedToken = security.decrypt(req.body.headers.Authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.deleteAccountTwitch(decoded.id)
          .then((result) => {
            res.send(result)
          }, (err) => {
            res.send(err)
          })
      }
    })
  });

    app.get(`${path}/members/reddit`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Users.fetchID(req.query.username)
          .then(user => {
            console.log(user)
            return Accounts.fetchOne(user._id)
          })
          .then(accounts => {
            return Tokens.redditRFSH(accounts)
          })
          .then(accounts => {
            return Request.redditFeed(accounts)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/members/twitch`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Users.fetchID(req.query.username)
          .then(user => {
            console.log(user)
            return Accounts.fetchOne(user._id)
          })
          .then(accounts => {
            return Tokens.twitchRFSH(accounts)
          })
          .then(accounts => {
            return Request.twitchFeed(accounts)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.get(`${path}/members/twitter`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Users.fetchID(req.query.username)
          .then(user => {
            console.log(user)
            return Accounts.fetchOne(user._id)
          })
          .then(accounts => {
            return Request.twitterFeed(accounts)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.post(`${path}/vote/reddit`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.redditVotes(result, req.body.data.vote)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.post(`${path}/comment/reddit`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.redditComment(result, req.body.data)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.post(`${path}/comment/twitter`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.twitterComment(result, req.body.data)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.post(`${path}/favorite/twitter`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.twitterFavorite(result, req.body.data.id)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

  app.post(`${path}/retweet/twitter`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Accounts.fetchOne(decoded.id)
          .then(result => {
            return Request.twitterRetweet(result, req.body.data)
          })
          .then((result) => {
            res.send(result)
          })
          .catch(error =>{
            console.log(error)
          })
      }
    })
  });

}

