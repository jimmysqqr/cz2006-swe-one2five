const axios = require('axios');
const {Client} = require("@googlemaps/google-maps-services-js");

const amenityTypeList = [
    "supermarket",
    "school",
    "bus_station",
    "train_station",
    "doctor" // display as healthcare on frontend 
]

// Method to find all nearby amenities (based on the defined list of amenities) of a particular destination
const findAllNearbyAmenities = async (flatLat, flatLon, amenityType = null, amenityDist = 1000) => { 
    // flatLat: flat latitude and flatLon: flat longtitude
    // default amenityType = null, meaning find all nearby amenities
    // assume nearby is 1km => amenityDist = 1000
    // valid amenityType: "supermarket", "school", "bus_station", "train_station", "doctor"

    if (amenityType) { // amenityType is specified -> perform a specific search, returns up to 20 instances

        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
            'location=' + flatLat + '%2C' + flatLon +
            '&radius=' + amenityDist +
            '&type=' + amenityType +
            '&rankby=prominence' +
            '&key=AIzaSyB4C3UfSaq-9qQXITAIHjCFCUqBWP2nUzM';

        let response = await axios.get(url);

        if (response.data.status === 'OK') {
            console.log(`No. of amenities found for type ${amenityType}: ${response.data.results.length}`);
        }
        else if (response.data.status === 'ZERO_RESULTS')
            console.log(`Not found amenities for type ${amenityType}`);
        else
            console.log(response.data.status);
        
        return new Promise((resolve) => {
            resolve(response);
        });

    } else { // amenityType is null (left blank) -> perform search on all 5 amenityTypes, max 4 instances each

        let master = [];
        
        for (let amenityType of amenityTypeList) {

            let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
                'location=' + flatLat + '%2C' + flatLon +
                '&radius=' + amenityDist +
                '&type=' + amenityType +
                '&rankby=prominence' +
                '&key=AIzaSyB4C3UfSaq-9qQXITAIHjCFCUqBWP2nUzM';

            let response = await axios.get(url);

            if (response.data.status === 'OK') {
                console.log(`No. of amenities found for type ${amenityType}: ${response.data.results.length}`);
                master = master.concat(
                    (response.data.results.length > 4) ? response.data.results.slice(0, 4) : response.data.results
                ); // take up to a max of 4 amenity instances of a type
            }
            else if (response.data.status === 'ZERO_RESULTS')
                console.log(`Not found amenities for type ${amenityType}`);
            else
                console.log(response.data.status);
        }

        console.log("Total amenity instances found: " + master.length);
        return new Promise((resolve) => {
            resolve(master);
        });
    }
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

// findAllNearbyAmenities(1.2987315362253664, 103.84791689288417) // some central area
// .then((result)=>{
//         console.log((result));
//     })

module.exports = {
    findAllNearbyAmenities,
    findCoords
}