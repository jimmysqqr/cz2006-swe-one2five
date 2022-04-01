const express = require('express');
const router = express.Router();

// Import controllers
const viewFlatDetails = require('../controllers/viewFlatDetails');

// Routes
router.route('/').get(viewFlatDetails);

module.exports = router;