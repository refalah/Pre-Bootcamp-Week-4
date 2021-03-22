const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');


//const connection  = require('./lib/db');

const formRouter = require('./routes/form');
const newsRouter = require('./routes/news');

// const initPassport = require('./passport-config');
// initPassport(passport, email => users.find());

const app = express();


dotenv.config({path: './.env'});


app.use(cookieParser());
app.use(express.static('public'));

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//take value from form, so post can access it
app.use(express.urlencoded({extended: false}));

//////////

app.use(session({
    secret: 'secret',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
/////ROUTES//////
app.use('/', formRouter);
app.use('/news', newsRouter);




app.listen(3000, () => {
    console.log('started on port 3000');
});