// Create mysql connection
const mysql = require('mysql')
require('dotenv').config()

const dbConn = mysql.createConnection({
    host: '114.119.173.223',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'one2five'
});

// Connect to mysql server
dbConn.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql connected...');
});


module.exports = dbConn;