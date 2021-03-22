const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { checkUsers } = require('../middleware/authMiddleware');


/////CREATE/////

router.get('/create',(req, res) => {
    res.render('news-create', {message: req.flash('message'), messageS: req.flash('messageS')});
})

router.post('/post-form', (req, res) => {
    const {title, description} = req.body;
    let error = false;

    if(title.length === 0 || description.length === 0){
        req.flash('message', "Please fill all the fields");
        res.redirect('/news/create')
    }

    db.query('INSERT INTO news SET ?', {title, description}, (err, result) => {
        if (err){
            console.log(err);
        } else {
            req.flash('messageS', "Success");
            res.redirect('/')
        }
    })
})


//////UPDATE////////


router.get('/edit/:id', (req, res) => {

    db.query("SELECT * FROM news WHERE id = ?", [req.params.id], function(err, rows, fields){
       
        //if data Not Found
        if(err){
            
            throw err
        }else {
            //Render Edit to edit.ejs
            res.render("news-edit", {
                id: rows[0].id,
                title: rows[0].title,
                description: rows[0].description
            })
        }
    })

    
})

router.post('/edit/:id', (req, res, next) => {
    const {title, description} = req.body;
    let param = [
        req.body, 
        req.params.id
    ]
    let errors = false;


    db.query("UPDATE news SET ? WHERE id = ?", param,(err, result) => {
        if (err){
            console.log(err);
        } else {
            //req.flash('messageS', "Success");
            res.redirect('/')
        }
    })
})

/////READ////////

router.get('/read/:id', (req, res) => {

    db.query("SELECT * FROM news WHERE id = ?", [req.params.id], function(err, rows, fields){
       
        //if data Not Found
        if(err){
            
            throw err
        }else {
            //Render Edit to edit.ejs
            res.render("read", {
                id: rows[0].id,
                title: rows[0].title,
                description: rows[0].description
            })
        }
    })

    
})

/////DELETE//////

router.get('/delete/:id', (req, res, next) => {
    const { id } = req.body;
    //res.render('index', {message: req.flash('message'), messageS: req.flash('messageS')});
    db.query("DELETE FROM news WHERE id = ?", [req.params.id], (err, result) =>{
        //if Err
        if(err){
            //req.flash("Error", err)
            throw err;
            res.redirect("/")
        }else{
            //req.flash("messageS", "Book successfully Deleted")
            res.redirect("/")
        }
    })
})



module.exports = router;






