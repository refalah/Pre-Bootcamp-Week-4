const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByEmail){
    const authUser = (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, {message: 'Email does not exist'});
        }

        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'}); 
            }
        } catch(err) {
            return done(err);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}), authUser);
    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})

}

module.exports = initialize;