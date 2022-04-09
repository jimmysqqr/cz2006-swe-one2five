const axios = require('axios');
const {Client} = require("@googlemaps/google-maps-services-js");
require('dotenv').config();

/**
 * Function to find nearby amenities of a particular type around a particular flat
 * 
 * @param {number|string} flatLat The flat's latitude
 * @param {number|string} flatLon The flat's longtitude
 * @param {string} amenityType Type of amenities - Default: null, meaning find nearby amenities of all types
 * @param {number|string} amenityDist Search radius from the flat - Default: 1000 m
 * @returns {Promise}
 */
const findNearbyAmenities = async (flatLat, flatLon, amenityType = null, amenityDist = 1000) => { 

    // actual url to call 
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
            'location=' + flatLat + '%2C' + flatLon +
            '&radius=' + amenityDist +
            (amenityType ? '&type=' + amenityType : '') +
            '&rankby=prominence' +
            '&key=' + process.env.Amenities_GGMapsAPIKey;

    // use axios to talk to G map api
    return axios.get(url);
}

/**
 * Function to find the coordinates of a particular address
 * 
 * @param {string} address 
 * @returns {Promise}
 */
const findCoords = async (address) => {
    const client = new Client({});
    return client.geocode({
        params: {
            address: address,
            key: process.env.Dist_Coords_GGMapsAPIKey
        },
        timeout: 1000 //ms
    })
};

/**
 * Function to find the road distance between src (1 place - coords) and dst (address)
 * 
 * @param {[]} src 
 * @param {string} dst 
 * @returns {Promise}
 */
const calcDistance = async (src, dst) => {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?' +
            'origins=' + src[0] + '%2C' + src[1] +
            '&destinations=' + dst +
            '&key=' + process.env.Dist_Coords_GGMapsAPIKey;

    return axios.get(url);
}

/**
 * Function to find the road distance between src (1 place - coords) and dst (addresses)
 * 
 * @param {[]} src 
 * @param {[]} dst 
 * @returns 
 */
const calcDistanceMD = async (src, dst) => {
    let url = 'https://maps.googleapis.com/maps/api/distancematrix/json?' +
              'origins=' + src[0] + '%2C' + src[1] + 
              '&destinations=' + 'place_id:' + dst[0];
    for (let i = 1; i < dst.length; i++) {
        url = url + '%7Cplace_id:' + dst[i];
    }
    url = url + '&mode=walking' + '&key=' + process.env.Dist_Coords_GGMapsAPIKey;

    return axios.get(url);
}

/* nominatim api call
const findCoords = async (blkNo, street) => {
    const url = `https://nominatim.openstreetmap.org/search?street=${blkNo}+${street}&country=singapore&format=json&limit=1`

    return await axios.get(url)
    // .then((response)=>{
        
    //     console.log(response.data[0]);
    // });
};
*/

module.exports = {
    findNearbyAmenities,
    findCoords,
    calcDistance,
    calcDistanceMD
}