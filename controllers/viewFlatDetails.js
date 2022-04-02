const {findAllNearbyAmenities} = require('../controllers/googleMapsTool');
const RentedOutFlat = require('../models/RentedOutFlat');
const SavedFlat = require('../models/SavedFlat');

const viewFlatDetails = async (req, res) => {
    if (req.query.flatStatus == "rented-out") {
        // Find the rented-out flat with that id
        const [rows, fields] = await RentedOutFlat.getById(req.query.id).catch(err => {
            console.log(err);
            res.status(500).json({
                message: `Error occurred while fetching rented-out flat with id ${req.query.id}`
            });
        });
        // if found
        if (rows.length) {
            console.log(`Found rented-out flat id ${req.query.id}`);
            const lat = rows[0].latitude;
            const lon = rows[0].longitude;
            // find all nearby amenities of that rented-out flat
            const amenitiesRes = await findAllNearbyAmenities(lat, lon).catch(err => {
                console.log(err);
                res.status(500).json({
                    message: `Error occurred while searching for amenities of rented-out flat with id ${req.query.id}`
                });
            });
            if (amenitiesRes.found > 0){
                console.log(`Total no. of amenities found: ${amenitiesRes.found}`);
                res.status(200).json({
                    data: amenitiesRes
                });
            }
            else if (amenitiesRes.found == 0) {
                console.log("Not found any amenities...");
                res.status(200).json({
                    message: "No amenities found",
                    data: amenitiesRes
                });
            }
        }
        // if not found  
        else {
            console.log(`No rented-out flat with id ${req.query.id}`);
            res.status(404).json({
                message: `No rented-out flat with id ${req.query.id}`
            });
        }
    }
    else if (req.query.flatStatus == "saved") {
        const [rows, fields] = await SavedFlat.getById(req.query.id, req.query.userToken).catch(err => {
            console.log(err);
            res.status(500).json({
                message: `Error occurred while fetching saved flat with id ${req.query.id}`
            });
        });
        if (rows.length) {
            console.log(`Found saved flat id ${req.query.id}`);
            const lat = rows[0].latitude;
            const lon = rows[0].longitude;
            const amenitiesRes = await findAllNearbyAmenities(lat, lon).catch(err => {
                console.log(err);
                res.status(500).json({
                    message: `Error occurred while searching for amenities of saved flat with id ${req.query.id}`
                });
            });
            if (amenitiesRes.found > 0){
                console.log(`Total no. of amenities found: ${amenitiesRes.found}`);
                res.status(200).json({
                    data: amenitiesRes
                });
            }
            else if (amenitiesRes.found == 0) {
                console.log("Not found any amenities...");
                res.status(200).json({
                    message: "No amenities found",
                    data: amenitiesRes
                });
            }
        }
        else {
            console.log(`No saved flat with id ${req.query.id}`);
            res.status(404).json({
                message: `No saved flat with id ${req.query.id}`
            });
        }
    }
}

module.exports = viewFlatDetails;