const jwt = require('jsonwebtoken');
const db = require('../lib/db');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('./login');
            } else {
                console.log(decodedToken.message);
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

//Check current USER

const checkUsers = (req, res, next) => {
    const token = req.cookies.jwt;
    const {email, password} = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('./login');
                } else {
                    console.log(decodedToken.message);

                    next();
                }
            })
        } else {
            
        }

    })
}














const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    // let user1 = [
    //     req.body, 
    //     req.params.id
    // ]
    // userId = req.params.id

    const {email, password} = req.body;
    //const id = result[0].id;
    db.query("SELECT * FROM users WHERE id = ?", [req.params.id], function(err, rows, fields){
       
        
        if(err){
            throw err
        }else {
            
            const userId = rows[0].id;
            const users = {
                id: rows[0].id,
                name: rows[0].name,
            }
            //Render Edit to edit.ejs
            // res.render("news-edit", {
            //     id: rows[0].id,
            //     title: rows[0].title,
            //     description: rows[0].description
            // })

            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                    if (err) {
                        console.log(err.message);
                        res.locals.user = null;
                        next();
                    } else {
                        console.log(decodedToken);
                        let user = await userId.equals(decodedToken.id);
                        res.locals.user = user;
                        next();
                    }
                })
            } else {
                res.locals.user = null;
                next();
            }

        }
    })

    

  

}

module.exports ={ requireAuth, checkUser,checkUsers};