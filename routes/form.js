//Setup Depedency
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const dotenv = require('dotenv');
const db = require('../lib/db');
const flash = require('express-flash');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser, checkUsers } = require('../middleware/authMiddleware');


dotenv.config({path: '../.env'});

const maxAge = process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000

//router.get('*', checkUsers)

router.get('/', requireAuth, (req, res) => {
    
    db.query('SELECT * FROM news ORDER BY id desc', (err, result) => {
        // if (err) throw err;
        
        // res.render('index', {data: result})
            
        if(err){
            //Render Error
            res.render("index", {data: ''})
        } else{
            //Render Data to Web
            res.render("index", {data: result})
        }
    })
})


/////LOGIN USER//////

router.get('/login',(req, res) => {
    res.render('login' , {message: req.flash('message')})
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('login', {
                message: 'Please fill in the required fields'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if(!result || !(await bcrypt.compare(password, result[0].password))){
                
                req.flash('message', 'Email/Password is incorrect');
                res.redirect('/login');
            } else {
                const id = result[0].id;
                //const maxAge = process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000


                const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                console.log(`The token is: ${token}`);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + maxAge
                    ),
                    httponly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');
            }
        })
    } catch (error) {
        console.log(error);
    }
});

/////REGISTER USER///////

router.get('/register', (req, res) => {
    res.render('register', {message: req.flash('message')})
})

router.post('/register', async (req, res) => {
    const {name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) =>{
        if(err){
            console.log(err);
        }

        if(result.length > 0){
            //return res.render('register', {message: 'Email already taken'});
            req.flash('message', 'Email already taken');
            res.redirect('/register');
        } else if(password !== passwordConfirm){
            //return res.render('register', {message: 'Password does not match'});
            req.flash('message', 'Password does not match');
            res.redirect('/register');
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (err, result) => {
            if (err){
                console.log(err);
            } else {
                //return res.render('register', {messageS: 'Register Successful'});
                res.redirect('/');
            }
        })

        res.redirect('/');
    })
});


/////Logout////

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
})



module.exports = router;