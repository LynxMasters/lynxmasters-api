const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const logger = require('morgan')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
require('dotenv').config()

const app = express()
app.use(logger('combined'))
app.use(bodyParser.json())
app.use(cors())


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/lynxmasters', { useNewUrlParser: true })
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


// configure routes here
require('../routes/users')(app)

require('express-debug')(app)

module.exports = app
