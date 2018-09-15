let Users = require("../models/users")
let multer  = require('multer')
let path = '/api/v1';
const jwt = require('jsonwebtoken');
let security = require('../utils/encryption-decryption')
require('dotenv').config({path:'./.env'})
const UIDGenerator = require('uid-generator')
let secret = process.env.JWT


module.exports = (app) => {
  // Add new user
  app.post(`${path}/users`, (req, res) => {
    Users.addUser(req.body).then(
      (message) => {
        res.send(message)
      },
      (err) => {
        res.send(err)
      }
    ).catch(function (error) {
      return error
    })
  })

  // Fetch single user
  app.get(`${path}/users/:id`, (req, res) => {
    Users.fetchOne(req.params.id).then(
      (user) => {
        res.send(user)
      },
      (err) => {
        console.error(err)
      }
    )
  })

  app.get(`${path}/member`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function (error, decoded) {
      if (error) {
            res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            })
            console.log(error)
      } else {
        Users.fetchMember(req.query.username).then(
          (user) => {
            res.send(user)
          },
          (err) => {
            console.error(err)
          }
        ).catch(function (error) {
            return error
        })
      }
    })
  })


  app.get(`${path}/user/me`, (req, res) => {
    let decryptedToken = security.decrypt(req.headers.authorization)
    console.log(decryptedToken)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
        console.log(error)
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        Users.fetchOne(decoded.id).then(
          (user) => {
            res.send(user)
          },
          (err) => {
            console.error(err)
          }
        )
      }
    })  
  })

  // Fetch all users
  app.get(`${path}/users`, (req, res) => {
    console.log(req.headers.authorization)
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function (error, decoded) {
      if (error) {
            res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            })
            console.log(error)
      } else {
        Users.fetchAll()
        .then(
          (users) => {
            res.send({users: users})
          },
          (err) => {
            console.error(err)
          }
        )
      }
    }) 
  })

  // Login user
  app.post(`${path}/auth/login`, (req, res) => {
    Users.loginUser(req.body).then(
      (user) => {
        res.send(user);
      },
      (err) => {
        res.send(err)
      }
    )
  })

  // Verify Users Identifiers
  app.post(`${path}/users/identifiers/`, (req, res) => {
    Users.userVerificationCheck(req.body).then(
      (user) => {
        res.send(user)
      },
      (err) => {
        res.send(err)
      }
    )
  })

  // Update a user
  app.put(`${path}/users/:id`, (req, res) => {
    Users.updateOne(req.params.id, req.body).then(
      (success) => {
        res.send({success: true})
      },
      (err) => {
        res.send(err)
      }
    ).catch(function (error) {
      return error
    })
  })

  // Update user account info
    app.put(`${path}/user/account`, (req, res) => {
        let decryptedToken = security.decrypt(req.headers.authorization)
        console.log(decryptedToken)
        jwt.verify(decryptedToken, secret, function (error, decoded) {
            if (error) {
                res.status(500).send({
                    auth: false,
                    message: 'Failed to authenticate token.'
                })
                console.log(error)
            } else {
                //console.log('req params id ' + req.params.id)
                //console.log('req booooody : ' + JSON.stringify(req.body))
                Users.updateOne(req.body._id, req.body).then(
                    (success) => {
                        res.send({success: true})
                        console.log('success')
                    },
                    (err) => {
                        res.send(err)
                    }
                ).catch(function (error) {
                    return error
                })
            }
        })
    })

  // Delete a user
  app.delete(`${path}/users/:id`, (req, res) => {
    Users.removeOne(req.params.id).then(
      (success) => {
        res.send({success: true})
      },
      (err) => {
        console.error(err)
      }
    )
  })

  app.post(`${path}/verify/token`, (req, res) => {
    let decryptedToken = security.decrypt(req.body.headers.Authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        res.status(200).send({
          auth: true,
          message: 'success'
        })
      }
    })
  })  
  

  // Avatar upload
  const uidgen = new UIDGenerator(null, UIDGenerator.BASE62)
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let folder = process.env.NODE_ENV === 'prod'
        ? process.env.PROD_UPLOAD_LOCATION
        : process.env.DEV_UPLOAD_LOCATION
      cb(null, folder)
    },
    filename: function (req, file, cb) {
      let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1)
      cb(null, req.body.user + uidgen.generateSync(UIDGenerator.BASE16) + '.' + ext)
    }
  })

  let upload = multer({ storage: storage })
  app.post(`${path}/uploads`, upload.single('image'), (req, res) => {
    console.log(process.env.NODE_ENV)
    return res.json({ message: 'success', filename: req.file.filename})
  })


}