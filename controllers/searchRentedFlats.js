const RentedOutFlat = require('../models/RentedOutFlat');
const {town_legend, flatTypes} = require('../models/HDB');
const amenityTypes = require('../models/Amenity');
const {searchByAmenity} = require('./googleMapsTool');
const {avgCalc, percentileCalc, predictPrice} = require('./priceCalculator');

/**
 * Function to search for rented-out flats based on town, flat_type, price, and nearby amenity
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const searchRentedFlats = async (req, res) => {
    const { town, flatType, numericFilters, amenityType, amenityDist } = req.query;

    // Prevent users from searching with only the amenity filter
    if (!(town || flatType || numericFilters) && amenityType) {
        console.log("Operation will overflow Google API Credits");
        res.status(400).json(
            {
                message: "Cannot carry out the operation because of Google API Credits limit"
            }
        );
        return;
    }

    // Check town's validity
    if(town && !(Object.values(town_legend).includes(town.toUpperCase()))) {
        console.log("Invalid Town");
        res.status(400).json(
            {
                message: "Invalid Town"
            }
        );
        return;
    }

    // Check flatType's validity
    if (flatType && !(flatTypes.includes(flatType.toUpperCase()))) {
        console.log("Invalid Flat Type");
        res.status(400).json(
            {
                message: "Invalid Flat Type"
            }
        );
        return;
    }

    // Check amenity filters' validity
    if (!amenityType && amenityDist) {
        console.log("Amenity Distance must be empty if Amenity Type is empty");
        res.status(400).json(
            {
                message: "Amenity Distance must be empty if Amenity Type is empty"
            }
        );
        return;
    }

    if (amenityType && !(amenityTypes.includes(amenityType))) {
        console.log("Invalid Amenity Type");
        res.status(400).json(
            {
                message: "Invalid Amenity Type"
            }
        );
        return;
    }

    if (amenityDist && (Number.isNaN(amenityDist) || amenityDist < 50)) {
        console.log("Amenity Distance must be a number");
        res.status(400).json(
            {
                message: "Amenity Distance must be a positive number larger than or equal to 50"
            }
        );
        return;
    }

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
                    res.status(400).json(
                        {
                            message: "Error: Please enter a numeric higher price bound"
                        }
                    );
                    return;
                }
                else if(hiPrBound < 0) {
                    console.log("Error: Please enter a positive number for higher price bound");
                    res.status(400).json(
                        {
                            message: "Error: Please enter a positive number for higher price bound"
                        }
                    );
                    return;
                }
            }

            // Get lower price bound
            else if (filter.search(/^price>=/g) != -1){
                loPrBound = Number(filter.replace(/^price>=/g, ''));

                if(isNaN(loPrBound)) {
                    console.log("Error: Please enter a numeric lower price bound");
                    res.status(400).json(
                        {
                            message: "Error: Please enter a numeric lower price bound"
                        }
                    );
                    return;
                }
                else if(loPrBound < 0) {
                    console.log("Error: Please enter a positive number for lower price bound");
                    res.status(400).json(
                        {
                            message: "Error: Please enter a positive number for lower price bound"
                        }
                    );
                    return;
                }
            }
        }

        if ((!hiPrBound && loPrBound) || (hiPrBound && !loPrBound)){
            console.log("Higher price bound and lower price bound must either both be present or both be absent");
            res.status(400).json(
                {
                    message: "Higher price bound and lower price bound must either both be present or both be absent"
                }
            );
            return;
        }

        if (loPrBound > hiPrBound) {
            console.log("Higher price bound cannot be smaller than lower price bound");
            res.status(400).json(
                {
                    message: "Higher price bound cannot be smaller than lower price bound"
                }
            );
            return;
        }
    }

    // Perform the search
    let [rows, fields] = await RentedOutFlat.search(town, flatType, loPrBound, hiPrBound).catch((err) => {
        console.log(err);
        res.status(500).json(
            {
                message: err.message || "Some errors occured while searching for rent-out flats according to user's filters"
            }
        );
    });
    //console.log("Search performed!");
    //console.log(`${rows.length} results`);

    // Only perform the search if no. of Nearby API requests is fewer than or equal to 2000
    if (amenityType && rows.length > 2000) {
        console.log("Cannot search by amenities on more than 2000 flat results");
        res.status(400).json(
            {
                message: "Cannot search by amenities on more than 2000 flat results"
            }
        );
        return;
    }

    // Check if amenityType param is not null
    if (amenityType) { // Search_by_amenity
        rows = await searchByAmenity(rows, amenityType, amenityDist).catch(err => {
            res.status(500).json(
                {
                    message: err.message || "Some errors occured while searching for rent-out flats according to user's filters"
                }
            );
        });
        //console.log("SearchByAmenity performed!");
        //console.log(`${rows.length} results`);
    }
    // Calc aggregated price statistics
    const avgPrice = avgCalc(rows);
    const [tenPer, ninetyPer] = percentileCalc(rows);
    const predictedPrice = predictPrice(rows);

    // Handle the output
    if (rows.length) {
        res.status(200).json({
            found: rows.length,
            data: {
                avgPrice: avgPrice,
                tenPer: tenPer,
                ninetyPer: ninetyPer,
                predictedPrice: predictedPrice,
                filteredFlatList: rows
            }
        });
    }
    else {
        res.status(404).json({
            message: "No rented-out flat satisfies the searching filters"
        });
    }
}

/**
 * Function to get all rented-out flats
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res
 */
const getAllRentedFlats = (req, res) => {
    RentedOutFlat.getAll((err, data) => {
        if (err)
            res.status(500).json(
                {
                    message: err.message || "Some errors occured while fetching rent-out flats"
                }
            );
        else res.status(200).json({
            found: data.length,
            data: data
        });
    })
}

/**
 * Function to get a rented-out flat by id
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res
 */ 
const getRentedFlat = async (req, res) => {
    const [rows, fields] = await RentedOutFlat.getById(req.params.id).catch(err => {
        console.log(err);
        res.status(500).json({
            message: `Error occurred while fetching rented-out flat with id ${req.params.id}`
        });
    });
    if (rows.length > 0) {
        console.log(`Found rented-out flat with id ${req.params.id}`);
        res.status(200).json({
            data: rows
        });
    }
    else {
        console.log(`No rented-out flat with id ${req.params.id}`);
        res.status(404).json({
            message: `No rented-out flat with id ${req.params.id}`
        });
    }
}

// Export controllers
module.exports = {
    getAllRentedFlats,
    getRentedFlat,
    searchRentedFlats
};