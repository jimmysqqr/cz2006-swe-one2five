const axios = require('axios');
const {Client} = require("@googlemaps/google-maps-services-js");
require('dotenv').config()

// Method to find nearby amenities of a particular destination
const findNearbyAmenities = async (flatLat, flatLon, amenityType = null, amenityDist = 1000) => { 
    // flatLat: flat latitude and flatLon: flat longtitude
    // default amenityType = null, meaning find all types of nearby amenities
    // assume nearby is 1km => amenityDist = 1000

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

// Method to find the coordinates of a particular address
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

// Method to find the road distance between src (coords) and dst (address)
const calcDistance = async (src, dst) => {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?' +
            'origins=' + src[0] + '%2C' + src[1] +
            '&destinations=' + dst +
            '&key=' + process.env.Dist_Coords_GGMapsAPIKey;

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
    calcDistance
}