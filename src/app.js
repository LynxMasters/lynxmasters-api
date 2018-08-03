const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const logger = require('morgan')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const passport = require('passport');
const flash    = require('connect-flash');
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

app.use(logger('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())
app.set('view engine', 'ejs');



mongoose.connect('mongodb://54.165.68.141:27017/lynxmasters', { useNewUrlParser: true })
let db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", function(callback){
  console.log("Connection Succeeded")
})

// config cookie parser middleware
app.use(cookieParser())
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 }}))//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// configure routes here
require('../routes/users')(app);
require('../routes/auth')(app);
require('express-debug')(app);

module.exports = app
