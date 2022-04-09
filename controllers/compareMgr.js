const SavedFlat = require('../models/SavedFlat');
const {findAllNearbyAmenities} = require('../controllers/googleMapsTool');
const findSimilarFlats = require('./similarFlatFinder');
const {avgCalc, percentileCalc, predictPrice} = require('./priceCalculator');

/**
 * Function to fetch all info for 1 saved flat for comparison
 * 
 * @param {number|string} id
 * @param {string} userToken
 * @returns {Promise} All info of 1 saved flat used for comparison
 */
const compare1 = async (id, userToken) => {
    // Fetch the saved flats used for comparison
    const [rows, fields] = await SavedFlat.getById(id, userToken).catch(err => {
        console.log(err);
        // res.status(500).json({
        //     message: `Error occurred while fetching saved flat with id ${id}`
        // });
    });
    if (rows.length == 0) {
        console.log(`No saved flat with id ${id}`);
        return new Promise(resolve => resolve(-1));
        // res.status(404).json({
        //     message: `No saved flat with id ${id}`
        // });
    }
    else {
        console.log(`Found saved flat id ${id}`);
    }
    const flat = rows[0];

    // Find saved flat's nearby amenities
    const amenitiesRes = await findAllNearbyAmenities(flat.latitude, flat.longitude).catch(err => {
        console.log(err);
    });
    if (amenitiesRes.found > 0){
        console.log(`Total no. of amenities found: ${amenitiesRes.found}`);
    }
    else if (amenitiesRes.found == 0) {
        console.log("Not found any amenities...");
    }

    // Find rented-out flats SIMILAR to saved flats
    const town = flat.town;
    const flat_type = flat.flat_type;
    const similarFlats = await findSimilarFlats(town, flat_type).catch((err) => {
        console.log(err);
    });
    if (similarFlats.length)
        console.log(`Found ${similarFlats.length} similar flats`);
    else
        console.log(`No similar flats found...`);

    // Calc aggregated price statistics of similar flats
    const averagePrice = avgCalc(similarFlats);
    const [tenPer, ninetyPer] = percentileCalc(similarFlats);
    const predictedPrice = predictPrice(similarFlats);

    // Return the info
    return new Promise(resolve => resolve({
        message: "Found Saved Flat!",
        data: {
            savedFlat: {
                id: flat.id,
                town: town,
                block: flat.block,
                street_name: flat.street_name,
                flat_type: flat_type,
                flat_status: flat.flat_status,
                monthly_rent: flat.monthly_rent,
                latitude: flat.latitude,
                longitude: flat.longitude,
                userToken: flat.userToken
            },
            similarFlatsFound: similarFlats.length,
            avgPrice: averagePrice,
            tenPer: tenPer,
            ninetyPer: ninetyPer,
            predictedPrice: predictedPrice,
            amenities: amenitiesRes
        }
    }));
}

/**
 * Function to compare side-by-side between saved flats
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const compare = async (req, res) => {
    // Process input - What are the saved flats (according to id) used for comparison?
    let ids = req.query.ids;
    ids = ids.split(',');

    // For each flat for comparison, fetch it and find the relevant info
    let response = [];
    for (const id of ids) {
        const flatInfo = await compare1(id, req.params.userToken);
        if (flatInfo == -1) {
            response = response.push({
                message: "Saved Flat not found...",
                data: null
            });
        }
        else {
            response.push(flatInfo);
        }
    }

    // Pass everything back to the frontend
    res.status(200).json(response);
}

module.exports = compare;