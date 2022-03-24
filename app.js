// Setup an Express server
const express = require('express');
const app = express();

// // Import MySql connection
// const connectDB = require('./db/connect');

// Import routers
const searchRentedFlats = require('./routes/searchRentedFlats');
const savedFlats = require('./routes/savedFlats');

// middleware
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.send("This is the homepage");
})

app.use('/api/v1/searchRentedFlats', searchRentedFlats);
app.use('/api/v1/savedFlats', savedFlats);

// API
// SearchRentedFlats api -- app.get('/api/v1/searchRentedFlats?town=A&flatType=B&numericFilters=price>2000,price<3000&amenityType=hospital&amentityDist=1000')
// Get 1 single rented-out flat - app.get('/api/v1/searchRented/:id')
// Get all saved flats - app.get('/api/v1/saved')
// Get 1 single saved flat - app.get('/api/v1/saved/:id')
// Create a new saved flat - app.post('/api/v1/saved')
// Delete 1 saved flat - app.delete('/api/v1/saved/:id')
// Get a flat's amenities - app.get('/api/v1/amenities)
// Lookup 1 flat - app.get('/api/v1/lookup')
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