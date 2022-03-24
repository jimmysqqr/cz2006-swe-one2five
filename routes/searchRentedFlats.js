const express = require('express');
const router = express.Router();

// Import controllers
const { getAllRentedFlats, getRentedFlat, searchRentedFlats } = require('../controllers/searchRentedFlats');

// Routes
router.route('/').get(searchRentedFlats);
router.route('/:id').get(getRentedFlat);

module.exports = router;