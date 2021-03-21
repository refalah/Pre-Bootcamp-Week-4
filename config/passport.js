const LocalStrategy   = require('passport-local').Strategy;

const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})


module.exports = function(passport) {
    passport.serializeUser((user, done) => {done(null, user.id)})
    passport.deserializeUser((id, done) => { 
        db.query('SELECT * FROM users WHERE id = '+id, (err,rows) =>{	
			done(err, rows[0]);
		});
    })

    passport.use('')

}