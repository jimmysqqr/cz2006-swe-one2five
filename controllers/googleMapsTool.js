const GoogleMaps  = require('../models/GoogleMaps');
const [findNearbyAmenities, findCoord] = [GoogleMaps.findNearbyAmenities, GoogleMaps.findCoords];

// Method to search for rented-out flats based on a nearby amenity
const searchByAmenity = async (rentedOutFlatList, amenityType, amenityDist) => {
    /*Function that takes in a list of rented-out flats (json) and return the rented-out flats (json) in that list that has a 
    nearby amenity of amenityType (e.g. hospital, school, etc.) within amenityDist m/km (whichever suitable)
    */
    let filteredList = [];

    for (const flat of rentedOutFlatList){
        let response = await findNearbyAmenities(flat.latitude, flat.longitude, amenityType, amenityDist).catch(err => {
            console.log(err);
        });
        if (response.data.status === 'OK'){
            // console.log(response.data.results[0].types)
            console.log(`No. of amenities found: ${response.data.results.length}`);
            filteredList.push(flat);
        }
        else if (response.data.status === 'ZERO_RESULTS')
            console.log("Not found amenities...");
        else
            console.log(response.data.status);
    };

    return new Promise((resolve) => {
        resolve(filteredList);
    });
}

// valid amenityType: "supermarket", "school", "bus_station", "train_station", "doctor"
const amenityTypeList = [
    "supermarket",
    "school",
    "bus_station",
    "train_station",
    "doctor" // display as healthcare on frontend 
]

// Method to find all nearby amenities (based on the defined list of amenities) of a particular flat
const findAllNearbyAmenities = async (flatLat, flatLon, amenityDist = 1000) => { 
    // flatLat: flat latitude and flatLon: flat longtitude
    // default amenityType = null, meaning find all nearby amenities
    // assume nearby is 1km => amenityDist = 1000
    // valid amenityType: "supermarket", "school", "bus_station", "train_station", "doctor"
    let master = [];
        
    for (let amenityType of amenityTypeList) {

        let response = await findNearbyAmenities(flatLat, flatLon, amenityType, amenityDist);

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

    // console.log("Total amenity instances found: " + master.length);
    return new Promise((resolve) => {
        resolve({
            found: master.length,
            amenityList: master
        });
    });
}

// Method to find the coordinates of a particular address
const findCoords = async (address) => {
    const response = await findCoord(address);
    console.log(response.data.results[0]);
    return new Promise((resolve) => {
        resolve(response.data.results[0]);
    });
}

// Method to find the road distance between Place0 and Place1
const calcDistance = (coords0, coords1) => {
    function haversine_distance(coords0, coords1) {
        var R = 6371.0710; // Radius of the Earth in km
        var rlat1 = coords0.position.lat() * (Math.PI/180); // Convert degrees to radians
        var rlat2 = coords1.position.lat() * (Math.PI/180); // Convert degrees to radians
        var difflat = rlat2-rlat1; // Radian difference (latitudes)
        var difflng = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)
    
        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflng/2)*Math.sin(difflng/2)));
        return d;
    }

    var distance = haversine_distance(mk1, mk2);

    // shows distance as message below map
    document.getElementById('straight-line-dist-msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " km";

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const route = {
        origin: coords0,
        destination: coords1,
        travelMode: 'DRIVING' //or walking, bicycling
    }

    directionsService.route(route,
        function(response, status) { // anonymous function to capture directions
            if (status !== 'OK') {
                window.alert('Directions request failed due to ' + status);
                return;
            } else {
                //directionsRenderer.setDirections(response); // Add route to the map
                var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                if (!directionsData) {
                    window.alert('Directions request failed');
                    return;
                }
                else {
                    // shows distance as message below map
                    document.getElementById('road-dist-msg').innerHTML += " Road distance is " + directionsData.distance.text + ".";
                }
            }
        });
}


module.exports = {
    searchByAmenity,
    findAllNearbyAmenities,
    findCoords,
    calcDistance
}