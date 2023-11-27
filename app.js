var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morganLogger  = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
var sanitizeHtml = require('sanitize-html');
require('dotenv').config();
var nodemailer = require('nodemailer');
//var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var rateLimit = require('express-rate-limit');

const winston = require('winston');

const customLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports.logger = customLogger;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var venuesRouter = require('./routes/venues');
var adminsRouter = require('./routes/admins');


var app = express();

var dbConnectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


dbConnectionPool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database: ", err);
        return;
    }
    console.log("Successfully connected to the database.");
    connection.release();
});



app.use(function(req, res, next) {
    req.pool = dbConnectionPool;
    next();
});


app.use(morganLogger('combined', {
    stream: {
      write: message => customLogger.info(message.trim())
    }
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/*
app.use(passport.initialize());
app.use(passport.session());
*/
app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true,
 cookie: { secure: false,httpOnly:true, maxAge: 30 * 60 * 1000 }
}));


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150 // limit each IP to 100 requests per windowMs
});
app.use('/users/login', loginLimiter);
app.use('/venues/login', loginLimiter);
app.use('/admins/login', loginLimiter);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/venues', venuesRouter);
app.use('/admins', adminsRouter);


app.use('/users', express.static(path.join(__dirname, 'private')));
app.use('/venues', express.static(path.join(__dirname, 'privateVenue')));
app.use('/admins', express.static(path.join(__dirname, 'privateAdmin')));

module.exports = app;
