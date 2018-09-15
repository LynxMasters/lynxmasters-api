const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const logger = require('morgan')
const session = require('express-session')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path')
require('dotenv').config({path:'./.env'})

app.use(logger('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())

let key = fs.readFileSync(path.join(__dirname,'../client.pem'))
let ca = fs.readFileSync(path.join(__dirname,'../ca.pem'))
let DBCONN = process.env.DB

let options = {
    ssl:true,
    sslCA: ca,
    sslKey: key,
    sslCert:key,
    useNewUrlParser: true
};

mongoose.connect(DBCONN,options)
let db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", function(callback){
  console.log("DB Connection Succeeded")
})

app.use(cookieParser())
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 }}))//app.use(passport.initialize());

// configure routes here
require('../routes/users')(app);
require('../routes/externalAPI')(app);
require('express-debug')(app);

module.exports = app
