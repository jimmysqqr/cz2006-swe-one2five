const express = require('express');
const router = express.Router();

// Import controllers
const calcDist = require('../controllers/distanceCalculator');

// Routes
router.route('/').get(calcDist);

module.exports = router;