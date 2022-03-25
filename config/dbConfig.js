// Create mysql connection
const mysql = require('mysql2')
require('dotenv').config()

const dbConn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Connect to mysql server
dbConn.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql connected...');
});


module.exports = dbConn;