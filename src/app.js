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
require('dotenv').config()

app.use(logger('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())
app.set('view engine', 'ejs');


const mongoose = require('mongoose')
mongoose.connect('mongodb://54.165.68.141:27017/lynxmasters', { useNewUrlParser: true })
let db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", function(callback){
  console.log("Connection Succeeded")
})

// app.set('trust proxy', 1) // trust first proxy
// // track login sessions
// app.use(session({
//   secret: 'doin thangs',  // for development only
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     maxAge: 30 * 24 * 60 * 60 * 1000,  // 1 month cookie
//     secure: false // true requires an https-enabled website
//   },
//   store: new mongoStore({mongooseConnection: db})
// }))

// config cookie parser middleware
app.use(cookieParser())
app.use(session({
    secret: '4234klj324kl3j4k3j4k234j3k4j23l4j43j42', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// configure routes here
require('../routes/users')(app);
require('../routes/routes.js')(app, passport);
require('../config/passport')(passport);
require('express-debug')(app);

module.exports = app
