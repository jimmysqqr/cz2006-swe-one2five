const express = require('express');
const router = express.Router();

// Import controllers
const compare = require('../controllers/compareMgr');

// Routes
router.route('/').get(compare);

module.exports = router;