const SavedFlat = require('../models/SavedFlat');
const findFlatCoords = require('../models/OneMap');

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
    // Check if input is empty
    if (!req.body) {
        res.status(400).json({
            message: "Input cannot be empty!"
        });
        return;
    }
    
    // Find the new saved flat's coordinates
    const result = await findFlatCoords(req.body.block, req.body.street_name).catch(err => {
        console.log(err);
    });

    let lat = null;
    let lon = null;

    if (result.data.found == 0)
        console.log("Cannot find the coordinates of the new saved flat");
    else {
        lat = result.data.results[0].latitude;
        lon = result.data.results[0].longitude;
    }

    // Create the new saved flat object
    const newSavedFlat = new SavedFlat({
        id: null,
        town: req.body.town,
        block: req.body.block,
        street_name: req.body.street_name,
        flat_type: req.body.flat_type,
        monthly_rent: null,
        latitude: lat,
        longitude: lon
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