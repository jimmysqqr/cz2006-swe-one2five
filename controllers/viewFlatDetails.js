const {findAllNearbyAmenities} = require('../models/GoogleMaps');
const RentedOutFlat = require('../models/RentedOutFlat');
const SavedFlat = require('../models/SavedFlat');

const viewFlatDetails = async (req, res) => {
    if (req.query.flatStatus == "rented-out") {
        const [rows, fields] = await RentedOutFlat.getById(req.query.id).catch(err => {
            console.log(err);
            res.status(500).json({
                message: `Error occurred while fetching rented-out flat with id ${req.query.id}`
            });
        });
        if (rows.length) {
            console.log(`Found rented-out flat id ${req.query.id}`);
            const lat = rows[0].latitude;
            const lon = rows[0].longitude;
            const amenitiesRes = await findAllNearbyAmenities(lat, lon).catch(err => {
                console.log(err);
                res.status(500).json({
                    message: `Error occurred while searching for amenities of rented-out flat with id ${req.query.id}`
                });
            });
            if (amenitiesRes.data.status === 'OK'){
                console.log(`No. of amenities found: ${amenitiesRes.data.results.length}`);
                res.status(200).json({
                    data: amenitiesRes.data.results
                });
            }
            else if (amenitiesRes.data.status === 'ZERO_RESULTS') {
                console.log("Not found amenities...");
                res.status(200).json({
                    message: "No amenities found",
                    data: []
                });
            }
            else
                console.log(amenitiesRes.data.status);
        }   
        else {
            console.log(`No rented-out flat with id ${req.query.id}`);
            res.status(404).json({
                message: `No rented-out flat with id ${req.query.id}`
            });
        }
    }
    else if (req.query.flatStatus == "saved") {
        const [rows, fields] = await SavedFlat.getById(req.query.id).catch(err => {
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
            if (amenitiesRes.data.status === 'OK'){
                console.log(`No. of amenities found: ${amenitiesRes.data.results.length}`);
                res.status(200).json({
                    data: amenitiesRes.data.results
                });
            }
            else if (amenitiesRes.data.status === 'ZERO_RESULTS') {
                console.log("Not found amenities...");
                res.status(200).json({
                    message: "No amenities found",
                    data: []
                });
            }
            else
                console.log(amenitiesRes.data.status);
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