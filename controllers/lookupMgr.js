const {getHDB, town_legend} = require('../models/HDB');
const findFlatCoords = require('../models/OneMap');
const {findAllNearbyAmenities} = require('../controllers/googleMapsTool');
const findSimilarFlats = require('./similarFlatFinder');
const {avgCalc, percentileCalc, predictPrice} = require('./priceCalculator');

const lookup = async (req, res) => {
    // Check if the inputted HDB address is valid
    const [rows, fields] = await getHDB(req.query.block, req.query.street_name).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: `Error occurred while checking for valid HDB address`
        });
    });
    if (!rows.length) {
        console.log(`Blk ${req.query.block} ${req.query.street_name} is an invalid HDB address`);
        res.status(400).json({
            message: "Invalid HDB address!"
        });
        return;
    }
    else {
        console.log(`Blk ${req.query.block} ${req.query.street_name} is a valid HDB address`);
    }
    
    // Getting the Target Flat's town
    const town_code = rows[0].bldg_contract_town;
    const town = town_legend[town_code];

    // Getting the Target Flat's coors
    let lat = null;
    let lon = null;
    const coords = await findFlatCoords(req.query.block, req.query.street_name).catch((err) => {
        console.log(err);
    });
    if (coords.data.found == 0)
        console.log("Cannot find the coordinates of the TargetFlat");
    else {
        lat = parseFloat(coords.data.results[0].LATITUDE);
        lon = parseFloat(coords.data.results[0].LONGITUDE);
    }

    // Getting nearby amenities of the Target Flat
    let amenitiesRes = await findAllNearbyAmenities(lat, lon).catch((err) => {
        console.log(err);
    });
    if (amenitiesRes.found > 0){
        // console.log(amenitiesRes.amenityList[0].types)
        console.log(`Total no. of amenities found: ${amenitiesRes.found}`);
    }
    else if (amenitiesRes.found == 0)
        console.log("Not found any amenities...");


    // Find similar flats
    const similarFlats = await findSimilarFlats(town, req.query.flatType).catch((err) => {
        console.log(err);
    });
    if (similarFlats.length)
        console.log(`Found ${similarFlats.length} similar flats`);
    else
        console.log(`No similar flats found...`);
    
    // Calc aggregated price of similar flats
    const averagePrice = avgCalc(similarFlats);
    const [tenPer, ninetyPer] = percentileCalc(similarFlats);
    const predictedPrice = predictPrice(similarFlats);
    
    // Pass all info back to frontend
    res.status(200).json({
        message: "Found Target Flat!",
        data: {
            targetFlat: {
                town: town,
                block: req.query.block,
                street_name: req.query.street_name,
                flat_type: req.query.flatType,
                monthly_rent: null,
                latitude: lat,
                longitude: lon
            },
            similarFlatsFound: similarFlats.length,
            avgPrice: averagePrice,
            tenPer: tenPer,
            ninetyPer: ninetyPer,
            predictedPrice: predictedPrice,
            amenities: amenitiesRes
        }
    });
}

module.exports = lookup;