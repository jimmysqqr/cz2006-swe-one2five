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

}

// Method to find the road distance between Place0 and Place1
const calcDistance = (coords0, coords1) => {

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
