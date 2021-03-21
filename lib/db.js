const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({path: '../.env'});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'news-blog-1'
})

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('connected to port 3000');
    }
})

module.exports = db;