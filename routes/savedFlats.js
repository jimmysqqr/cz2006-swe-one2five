const express = require('express');
const router = express.Router();

// Import controllers
const { getAllSavedFlats, getSavedFlat, createSavedFlat, deleteSavedFlat } = require('../controllers/savedFlats')

// Routes
router.route('/').get(getAllSavedFlats).post(createSavedFlat);
router.route('/:id').get(getSavedFlat).delete(deleteSavedFlat);

module.exports = router;