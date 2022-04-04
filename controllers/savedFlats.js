const SavedFlat = require('../models/SavedFlat');
const findFlatCoords = require('../models/OneMap');

// Get all saved flats
const getAllSavedFlats = (req, res) => {
    SavedFlat.getAll(req.params.userToken, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Some error occurred while fetching saved flats"
            })
        }
        else res.status(200).json({
            found: data.length,
            data: data
        });
    })
}

// Get saved flat by id
const getSavedFlat = async (req, res) => {
    const [rows, fields] = await SavedFlat.getById(req.params.id, req.params.userToken).catch(err => {
        console.log(err);
        res.status(500).json({
            message: `Error occurred while fetching saved flat id ${req.params.id}`
        });
    });
    if (rows.length > 0) {
        console.log(`Found rented-out flat id ${req.params.id}`);
        res.status(200).json({
            data: rows
        });
    }
    else {
        console.log(`No saved flat with id ${req.params.id}`);
        res.status(404).json({
            message: `No saved flat with id ${req.params.id}`
        });
    }
}

// Create a new saved flat
const createSavedFlat = async (req, res) => {
    // Check if input is empty
    if (!req.body) {
        console.log("Input cannot be empty!");
        res.status(400).json({
            message: "Input cannot be empty!"
        });
        return;
    }

    // Check if input's block, street_name or flat_type field is empty
    if (!req.body.block || !req.body.street_name || !req.body.flat_type) {
        console.log("Lacking input fields!");
        res.status(400).json({
            message: "Lacking input fields!"
        });
        return;
    }

    // Check if input's rented_out_id is valid
    if (req.body.rented_out_id && (req.body.rented_out_id < 1 || req.body.rented_out_id > 39569)) {
        console.log("rented_out_id field is invalid!");
        res.status(400).json({
            message: "rented_out_id field is invalid!"
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
        lat = parseFloat(result.data.results[0].LATITUDE);
        lon = parseFloat(result.data.results[0].LONGITUDE);
    }

    // Create the new saved flat object
    const newSavedFlat = new SavedFlat({
        id: null,
        town: req.body.town,
        block: req.body.block,
        street_name: req.body.street_name,
        flat_type: req.body.flat_type,
        flat_status: 'saved',
        monthly_rent: null,
        latitude: lat,
        longitude: lon,
        userToken: req.params.userToken,
        rented_out_id: req.body.rented_out_id
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
    SavedFlat.remove(req.params.id, req.params.userToken, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `No saved flat with id ${req.params.id}`
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