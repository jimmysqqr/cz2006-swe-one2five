const express = require('express');
const router = express.Router();

// Import controllers
const lookup = require('../controllers/lookupMgr');

// Routes
router.route('/').get(lookup);

module.exports = router;