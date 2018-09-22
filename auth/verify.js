require('dotenv').config({path:'./.env'})
let jwt = require('jsonwebtoken');
let security = require('../utils/encryption-decryption')
let secret = process.env.JWT 


function verifyToken(req, res, next) {
  if(req.headers.authorization == null){
    res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
    })
  }else{
    let decryptedToken = security.decrypt(req.headers.authorization)
    jwt.verify(decryptedToken, secret, function(error, decoded) {
      if (error) {
        res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      }else{
        req.id = decoded.id
        next();
      }
    })
  }
}
module.exports = verifyToken;