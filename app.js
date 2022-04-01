// Setup an Express server
const express = require('express');
const app = express();

// // Import MySql connection
// const connectDB = require('./db/connect');

// Import routers
const searchRentedFlats = require('./routes/searchRentedFlats');
const savedFlats = require('./routes/savedFlats');
const lookup = require('./routes/lookup');
const compare = require('./routes/compare');
const clickOnFlat = require('./routes/clickOnFlat');

// middleware
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.send("This is the homepage");
})

app.use('/api/v1/searchRentedFlats', searchRentedFlats);
app.use('/api/v1/savedFlats', savedFlats);
app.use('/api/v1/lookup', lookup);
app.use('/api/v1/compare', compare);
app.use('/api/v1/clickOnFlat', clickOnFlat);

// API endpoints

// Rented-out Flats:
// SearchRentedFlats api - app.get('/api/v1/searchRentedFlats?town=Punggol&flatType=3-room&numericFilters=price>=2000,price<=3000&amenityType=hospital&amenityDist=1000')
// Get all rented-out flats - app.get('/api/v1/searchRentedFlats/')
// Get 1 single rented-out flat - app.get('/api/v1/searchRentedFlats/:id')

// Saved Flats:
// Get all saved flats - app.get('/api/v1/savedFlats')
// Get 1 single saved flat - app.get('/api/v1/savedFlats/:id')
// Create a new saved flat - app.post('/api/v1/savedFlats')
// Delete 1 saved flat - app.delete('/api/v1/savedFlats/:id')

// Lookup 1 Target Flat - app.get('/api/v1/lookup?block=1&street_name=BEACH RD&flatType=3-room')
// View Flat Details - app.get('/api/v1/clickOnFlat?flatStatus=rented-out&id=3788')
// Compare Saved Flats - app.get('/api/v1/compare?ids=1,2,3')

// NOT AVAILABLE YET
// Check distance - app.get('/api/v1/distance?')

// Fetch all rentedOutFlats
// app.get('/api/v1/searcha', (req, res) => {
//     let sql = 'SELECT * FROM rentedoutflats'
//     db.query(sql, (err, results)=>{
//         if(err) throw err;
//         console.log("Fetch successful");
//         res.send(results)
//     })
// })

// // localhost:5000/api/v1/search?numericFilters=price>2000,price<3000

// app.get('/api/v1/search', (req, res) => {
//     const priceSearch = /price/g

//     let  numericFilters = req.query.numericFilters
//     if (numericFilters) {
//         console.log(numericFilters)
//     }
//     numericFilters = numericFilters.replace(priceSearch, "monthly_rent")
//     numericFilters = numericFilters.replace(',', ' AND ')
//     console.log(numericFilters)

//     let sql = `SELECT * FROM rentedoutflats WHERE ${numericFilters}`

//     db.query(sql, (err, results)=>{
//         if(err) throw err;
//         console.log("Fetch successful");
//         res.send(results)
//     })
// })

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});

// const start = () => {
//     try {
//         connectDB(process.env.MYSQL_PASSWORD);
//         app.listen(port, () => {
//             console.log(`Server is listening on port ${port}...`);
//         });
//     } catch(error) {
//         console.log(error);
//     }
// }

// start();