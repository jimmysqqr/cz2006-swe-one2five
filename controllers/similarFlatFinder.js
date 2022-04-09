const RentedOutFlat = require('../models/RentedOutFlat');

/**
 * Function to find similar flats to a Target Flat
 * 
 * @param {string} town 
 * @param {string} flatType 
 * @returns {Promise}
 */
const findSimilarFlats = async (town,  flatType) => {
    let [rows, fields] = await RentedOutFlat.search(town, flatType);
    // return the list of similar flats (flats from the same town and of the same flat type)
    return new Promise(resolve => resolve(rows));
}

module.exports = findSimilarFlats;