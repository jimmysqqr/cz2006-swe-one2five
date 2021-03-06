const GoogleMaps  = require('../models/GoogleMaps');
const [findNearbyAmenities, findCoord, calcDist, calcDistanceMD] = [GoogleMaps.findNearbyAmenities, GoogleMaps.findCoords, GoogleMaps.calcDistance, GoogleMaps.calcDistanceMD];

/**
 * Function to search for rented-out flats based on a nearby amenity
 * Implemented by taking in a list of rented-out flats (json) and return the rented-out flats (json) in that list that has a 
    nearby amenity of amenityType (e.g. healthcare, school, etc.) within amenityDist m
 * 
 * @param {*} rentedOutFlatList List of rented-out flats
 * @param {string} amenityType 
 * @param {number|string} amenityDist in meters, default = 1000
 * @returns {Promise}
 */
const searchByAmenity = async (rentedOutFlatList, amenityType, amenityDist = 1000) => {
    let filteredList = [];

    for (const flat of rentedOutFlatList){
        const response = await findNearbyAmenities(flat.latitude, flat.longitude, amenityType, amenityDist).catch(err => {
            console.log(err);
        });
        if (response.data.status === 'OK'){
            // console.log(response.data.results[0].types)
            // console.log(`No. of amenities found: ${response.data.results.length}`);
            filteredList.push(flat);
        }
        // else if (response.data.status === 'ZERO_RESULTS')
        //     console.log("Not found amenities...");
        else
            console.log(response.data.status);
    };

    return new Promise((resolve) => {
        resolve(filteredList);
    });
}

// valid amenityType: "supermarket", "school", "bus_station", "subway_station", "doctor"
const amenityTypeList = [
    "supermarket",
    "school",
    "bus_station",
    "subway_station",
    "doctor" // display as healthcare on frontend 
]

/**
 * Function to find all nearby amenities (based on the defined list of amenities) of a particular flat
 * 
 * @param {number|string} flatLat The flat's latitude
 * @param {number|string} flatLon The flat's longtitude
 * @param {number|string} amenityDist in meters, default = 1000
 * @returns {Promise}
 */
const findAllNearbyAmenities = async (flatLat, flatLon, amenityDist = 1000) => { 
    // default amenityType = null, meaning find all nearby amenities
    // valid amenityType: "supermarket", "school", "bus_station", "subway_station", "doctor"
    let master = [];
    let master_placeids = [];
    for (let amenityType of amenityTypeList) {

        let response = await findNearbyAmenities(flatLat, flatLon, amenityType, amenityDist);

        if (response.data.status === 'OK') {
            // console.log(`No. of amenities found for type ${amenityType}: ${response.data.results.length}`);
            master = master.concat(
                (response.data.results.length > 4) ? response.data.results.slice(0, 4) : response.data.results
            ); // take up to a max of 4 amenity instances of a type
        }
        else if (response.data.status === 'ZERO_RESULTS')
            console.log(`Not found amenities for type ${amenityType}`);
        else {
            console.log(response.data.status);
        }
    }
    // Calculating road distance from Flat to each amenity
    for (amenity of master) {
        master_placeids.push(amenity.place_id);
    }
    const distRes = await calcDistanceMD([flatLat, flatLon], master_placeids).catch(err => {
        console.log(err);
    });
    if (distRes.data.status === 'OK') {
        // console.log('Successfully calculate distance from Flat to each amenity!');
    }
    // Add the road distance info from Flat into each amenity
    for (let i = 0; i < master.length; i++) {
        master[i].dist_from_flat = distRes.data.rows[0].elements[i].distance;
    }

    // console.log("Total amenity instances found: " + master.length);
    return new Promise((resolve) => {
        resolve({
            found: master.length,
            amenityList: master
        });
    });
}

/**
 * Function to find the coordinates of a particular address
 * 
 * @param {string} address 
 * @returns {Promise}
 */
const findCoords = async (address) => {
    const response = await findCoord(address);
    // console.log(response.data.results[0]);
    return new Promise((resolve) => {
        resolve(response.data.results[0]);
    });
}

/**
 * Function to find the road distance between a flat [lat, lng] and a custom location (address, no need to be no. street_name)
 * 
 * @param {*} flat 
 * @param {string} cusLoc 
 * @returns {Promise}
 */
const calcDistance = async (flat, cusLoc) => {
    const distRes = await calcDist(flat, cusLoc).catch(err => {
        console.log(err);
        if (distRes.data.status === 'INVALID_REQUEST') {
            return new Promise(resolve => resolve({
                status: 400
            }));
        }
        else if (distRes.data.status === 'UNKNOWN_ERROR') {
            return new Promise(resolve => resolve({
                status: 500
            }));
        }
        else {
            return new Promise(resolve => resolve({
                status: distRes.data.status
            }));
        }
    });
    if (distRes.data.status === 'OK') {
        console.log('Successfully calculate distance!');
        return new Promise(resolve => resolve({
            status: 200,
            data: distRes.data.rows[0].elements[0].distance
        }));
    }
    
    // function haversine_distance(coords0, coords1) {
    //     var R = 6371.0710; // Radius of the Earth in km
    //     var rlat1 = coords0.position.lat() * (Math.PI/180); // Convert degrees to radians
    //     var rlat2 = coords1.position.lat() * (Math.PI/180); // Convert degrees to radians
    //     var difflat = rlat2-rlat1; // Radian difference (latitudes)
    //     var difflng = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)
    
    //     var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflng/2)*Math.sin(difflng/2)));
    //     return d;
    // }

    // var distance = haversine_distance(mk1, mk2);

    // // shows distance as message below map
    // document.getElementById('straight-line-dist-msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " km";

    // let directionsService = new google.maps.DirectionsService();
    // let directionsRenderer = new google.maps.DirectionsRenderer();
    // directionsRenderer.setMap(map);

    // const route = {
    //     origin: coords0,
    //     destination: coords1,
    //     travelMode: 'DRIVING' //or walking, bicycling
    // }

    // directionsService.route(route,
    //     function(response, status) { // anonymous function to capture directions
    //         if (status !== 'OK') {
    //             window.alert('Directions request failed due to ' + status);
    //             return;
    //         } else {
    //             //directionsRenderer.setDirections(response); // Add route to the map
    //             var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
    //             if (!directionsData) {
    //                 window.alert('Directions request failed');
    //                 return;
    //             }
    //             else {
    //                 // shows distance as message below map
    //                 document.getElementById('road-dist-msg').innerHTML += " Road distance is " + directionsData.distance.text + ".";
    //             }
    //         }
    //     });
}


module.exports = {
    searchByAmenity,
    findAllNearbyAmenities,
    findCoords,
    calcDistance
}