const SavedFlat = require('../models/SavedFlat');

// Get all saved flats
const getAllSavedFlats = (req, res) => {
    // res.send('Get all saved flats');
    SavedFlat.getAll((err, data) => {
        if (err) {
            res.status(500).json({
                message: "Some error occurred while fetching saved flats"
            })
        }
        else res.status(200).json(data);
    })
}

// Get saved flat by id
const getSavedFlat = (req, res) => {
    // res.json({ id:req.params.id });
    SavedFlat.getById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `No saved flat with if ${req.params.id}`
                });
            }
            else {
                res.status(500).json({
                    message: `Error occurred while fetching saved flat id ${req.params.id}`
                });
            }
        }
        else res.status(200).json(data);
    })
}

// Create a new saved flat
const createSavedFlat = async (req, res) => {
    // Create the new saved flat object
    const newSavedFlat = new SavedFlat({
        id: null,
        town: req.body.town,
        block: req.body.block,
        street_name: req.body.street_name,
        // latitude: null,
        // longtitude: null,
        flat_type: req.body.flat_type,
        monthly_rent: null
    });

    // Save the new saved flat in the database
    SavedFlat.create(newSavedFlat, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Some error occurred while creating a new saved flat"
            });
        }
        else res.status(200).json({
            message: "Save flat!",
            data: data
        });
    });
}

// Delete a saved flat
const deleteSavedFlat = (req, res) => {
    // res.send('delete saved flat of id x');
    SavedFlat.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `No saved flat with if ${req.params.id}`
                });
            }
            else {
                res.status(500).json({
                    message: `Error occurred while deleting saved flat id ${req.params.id}`
                });
            }
        }
        else res.status(200).json({
            message: `Saved Flat id ${req.params.id} was deleted successfully`
        });
    });
}

// Export controllers
module.exports = {
    getAllSavedFlats,
    getSavedFlat,
    createSavedFlat,
    deleteSavedFlat
};