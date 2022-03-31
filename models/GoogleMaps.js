const axios = require('axios');
const {Client} = require("@googlemaps/google-maps-services-js");

// Method to find all nearby amenities (based on the defined list of amenities) of a particular destination
const findAllNearbyAmenities = async (flatLat, flatLon, amenityType = null, amenityDist = 1000) => { 
    // flatLat: flat latitude and flatLon: flat longtitude
    // default amenityType = null, meaning find all nearby amenities
    // assume nearby is 1km => amenityDist = 1000
    // valid amenityType: stadium, gym, hospital, school, shopping_mall, restaurant, park, supermarket, gas_station ,library, bus_station, train_station

    // actual url to call 
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
            'location=' + flatLat + '%2C' + flatLon +
            '&radius=' + amenityDist +
            (amenityType ? '&type=' + amenityType : '') +
            '&key=AIzaSyB4C3UfSaq-9qQXITAIHjCFCUqBWP2nUzM';

    // use axios to talk to G map api
    return axios.get(url);
}

// Method to find the coordinates of a particular address
const findCoords = async (address) => {
    const client = new Client({});
    return client.geocode({
        params: {
            address: address,
            key: "AIzaSyAW-ZULfCaxKjHOBkyCMLen528JeXpiKQk"
        },
        timeout: 1000 //ms
    })
    // .then((r) => {
    //     console.log(r.data.results[0]);
    // }).catch(e => {
    //     console.log(e.response.data.error_message);
    // });
    // r.data.results[0].geometry.location.lng
};

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
    findAllNearbyAmenities,
    findCoords
}