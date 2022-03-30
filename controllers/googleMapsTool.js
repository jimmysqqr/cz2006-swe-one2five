const { response } = require('express');

// Method to search for rented-out flats based on a nearby amenity
const searchByAmenity = (rentedOutFlatList, amenityType, amenityDist) => {
    /*Function that takes in a list of rented-out flats (json) and return the rented-out flats (json) in that list that has a 
    nearby amenity of amenityType (e.g. hsopital, school, etc.) within amenityDist m/km (whichever suitable)
    */
    
    // only return AFTER finishing for loop & receiving results from findAllNearbyAmenities()
    async function filterAsync(){
        let filteredList = []; 

        for (let flat of rentedOutFlatList){
            let response = await findAllNearbyAmenities(flat, amenityType, amenityDist);
            if (response.status === 'OK'){
                filteredList.push(flat);
            } 
        };
 
        return filteredList;
    }

    // only return result AFTER filterList() is done
    return filterAsync().then(data => { return data; })

}

// Method to find all nearby amenities (based on the defined list of amenities) of a particular flat
const findAllNearbyAmenities = (flatCoords, amenityType = null, amenityDist = 1000) => { 
    // flatCoords: longtitude and latitude // assume nearby is 1km
        /* im assuming it's 
        flatCoords = {
            lat:123,
            lng:456
        }
        */

    // actual url to call 
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
            'location=' + flatCoords.lat + '%2C' + flatCoords.lng +
            '&radius=' + amenityDist +
            (amenityType ? '&type=' + amenityType : '') +
            '&key=AIzaSyB4C3UfSaq-9qQXITAIHjCFCUqBWP2nUzM';

    // use axios to talk to G map api, only return AFTER receiving response
    var axios = require('axios');   
    async function callApiAsync() {
        const response = await axios.get(url)
        return response.data
    }

    // only return result AFTER callAPI() is done
    return callApiAsync().then(data => { return data; });

}

// Method to find the coordinates of a particular address
const findCoords = (address) => {
    geocoder = new google.maps.Geocoder();

    // add marker?
    /*marker = new google.maps.Marker({
    	map,
    });*/

    coords = geocode({ address: address })[0].geometry.location;

    return coords;

    /*function geocode(request) {
        clear();
        geocoder
            .geocode(request)
            .then((result) => {
                const { results } = result;
    
                //console.log(results[0]);
                //map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
                marker.setMap(map);
                
                return results;
            })
            .catch((e) => {
                alert("Geocode was not successful for the following reason: " + e);
            });
    }*/
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








// DEBUG //

/* 
// test data
rentedOutFlatList = [
    { // NS
        lat:1.3471940782229364,
        lng:103.68077682078855
    },
    { // Pioneer mall
        lat:1.3418851208330858, 
        lng:103.69738694571976
    }
];

amenityType = 'gym';
amenityDist = '200' // meters
*/

/* 
// (1) findAllNearbyAmenities

async function test(){
    const a = await findAllNearbyAmenities(rentedOutFlatList[0]);
    console.log("the function returns:");
    console.log(a);
    return a;
}

test()
*/

/* 
// (2) searchByAmenity

async function test(){
    const b = await searchByAmenity(rentedOutFlatList, amenityType, amenityDist);
     console.log("the function returns:");
     console.log(b);
}

test();
*/
