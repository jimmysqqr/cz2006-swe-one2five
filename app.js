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
const calcDist = require('./routes/calcDist');

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
app.use('/api/v1/distance', calcDist);

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
// Check distance - app.get('/api/v1/distance?flatLat=1.33943033543358&flatLng=103.853442790992&dst=Catholic Junior College')


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