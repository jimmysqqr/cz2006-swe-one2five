const express = require('express');
const router = express.Router();

// Import controllers
const { getAllSavedFlats, getSavedFlat, createSavedFlat, deleteSavedFlat } = require('../controllers/savedFlats');

// Routes
router.route('/:userToken').get(getAllSavedFlats).post(createSavedFlat);
router.route('/:userToken/:id').get(getSavedFlat).delete(deleteSavedFlat);

module.exports = router;