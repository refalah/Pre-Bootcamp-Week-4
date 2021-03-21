const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const path = require('path');


//const connection  = require('./lib/db');

const formRouter = require('./routes/form');
const newsRouter = require('./routes/news');

// const initPassport = require('./passport-config');
// initPassport(passport, email => users.find());

const app = express();


dotenv.config({path: './.env'});

// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE
// })

// db.connect((error) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('connected to port 3000');
//     }
// })

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

// app.get('/', (req, res) => {
//     res.render('index')
// })

// app.get('/login', (req, res) => {
//     res.render('login')
// })

// app.post('/login', async (req, res) => {
//     try {
//         const {email, password} = req.body;

//         if(!email || !password){
//             return res.status(400).render('login', {
//                 message: 'Please fill in the required fields'
//             })
//         }

//         db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
//             if(!result || !(await bcrypt.compare(password, result[0].password))){
//                 res.status(401).render('login', {message: 'Email/Password is incorrect'});
//             } else {
//                 const id = result[0].id;


//                 const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
//                     expiresIn: process.env.JWT_EXPIRES_IN
//                 })

//                 //console.log(`The token is: ${token}`);

//                 const cookieOptions = {
//                     expires: new Date(
//                         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//                     ),
//                     httponly: true
//                 }

//                 res.cookie('jwt', token, cookieOptions);
//                 res.status(200).redirect('/');
//             }
//         })
//     } catch (error) {
//         console.log(error);
//     }
// });

// app.get('/register', (req, res) => {
//     res.render('register')
// })

// app.post('/register', async (req, res) => {
//     const {name, email, password, passwordConfirm} = req.body;
//     let error1 = 0

//     db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) =>{
//         if(err){
//             console.log(err);
//         }

//         if(result.length > 0){
//             return res.render('register', {message: 'Email already taken'});
//         } else if(password !== passwordConfirm){
//             //return res.render('register', {message: 'Password does not match'});
//             req.flash('password does not match', err);
//         }

//         let hashedPassword = await bcrypt.hash(password, 8);
//         console.log(hashedPassword);

//         db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (err, result) => {
//             if (err){
//                 console.log(err);
//             } else {
//                 return res.render('register', {messageS: 'Register Successful'});
//             }
//         })
//     })
// });

////////////////


app.listen(3000, () => {
    console.log('started on port 3000');
});