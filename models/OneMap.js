const axios = require('axios');

/**
 * Function to find the coordinates of a particular flat
 * 
 * @param {number|string} blk 
 * @param {string} street 
 * @returns {Promise}
 */
const findFlatCoords = async (blk, street) => {
    const address = blk + " " + street;
    url = 'https://developers.onemap.sg/commonapi/search?searchVal=' + address + '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
    return axios.get(url);
};

module.exports = findFlatCoords;