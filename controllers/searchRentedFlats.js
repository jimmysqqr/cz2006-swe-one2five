const RentedOutFlat = require('../models/RentedOutFlat');

// Search for rented-out flats based on town, flat_type, price, and nearby amenity
const searchRentedFlats = (req, res) => {
    const { town, flatType, numericFilters, amenityType, amenityDist } = req.query;
    // console.log(town, flatType, numericFilters, amenityType, amenityDist);

    // // If no search filter is inputted, return the whole list of rented-out flats
    // if (!(town || flatType || numericFilters || amenityType || amenityDist)) {
    //     RentedOutFlat.getAll((err, data) => {
    //         if (err)
    //             res.status(500).json(
    //                 {
    //                     message: err.message || "Some errors occured while fetching rent-out flats"
    //                 }
    //             );
    //         else res.status(200).json(data);
    //     })
    //     return;
    // }

    let loPrBound = null;
    let hiPrBound = null;
    
    // Process numericFilters
    if (numericFilters) {
        let numericSeparateFilters = numericFilters.split(',');
        for (let i = 0; i < numericSeparateFilters.length; i++) {
            let filter = numericSeparateFilters[i];

            // Get higher price bound
            if (filter.search(/^price<=/g) != -1){
                hiPrBound = Number(filter.replace(/^price<=/g, ''));

                if(isNaN(hiPrBound)) {
                    console.log("Error: Please enter a numeric higher price bound");
                    return;
                }
            }

            // Get lower price bound
            else if (filter.search(/^price>=/g) != -1){
                loPrBound = Number(filter.replace(/^price>=/g, ''));

                if(isNaN(loPrBound)) {
                    console.log("Error: Please enter a numeric lower price bound");
                    return;
                }
            }
        }
    }

    // Perform the search
    RentedOutFlat.search(town, flatType, loPrBound, hiPrBound, (err,data) => {
        if (err)
            res.status(500).json(
                {
                    message: err.message || "Some errors occured while searching for rent-out flats according to user's filters"
                }
            );
        else res.status(200).json(data);
    })
    // Search_by_amenity
}


// Get all rented-out flats
const getAllRentedFlats = (req, res) => {
    RentedOutFlat.getAll((err, data) => {
        if (err)
            res.status(500).json(
                {
                    message: err.message || "Some errors occured while fetching rent-out flats"
                }
            );
        else res.status(200).json(data);
    })
}

// Get a rented-out flat by id
const getRentedFlat = (req, res) => {
    // res.send('rented-out flat of id x');
    RentedOutFlat.getById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `No rented-out flat with id ${req.params.id}`
                });
            }
            else {
                res.status(500).json({
                    message: `Error occurred while fetching rented-out flat with id ${req.params.id}`
                });
            }
        }
        else res.status(200).json(data);
    });
}

// Export controllers
module.exports = {
    getAllRentedFlats,
    getRentedFlat,
    searchRentedFlats
};