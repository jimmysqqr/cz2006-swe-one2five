const RentedOutFlat = require('../models/RentedOutFlat');
const {searchByAmenity} = require('./googleMapsTool');
const {avgCalc, percentileCalc, predictPrice} = require('./priceCalculator');

// Search for rented-out flats based on town, flat_type, price, and nearby amenity
const searchRentedFlats = async (req, res) => {
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
    let [rows, fields] = await RentedOutFlat.search(town, flatType, loPrBound, hiPrBound).catch((err) => {
        console.log(err);
        res.status(500).json(
            {
                message: err.message || "Some errors occured while searching for rent-out flats according to user's filters"
            }
        );
    });
    console.log("Search performed!");
    console.log(`${rows.length} results`);

    // Check if amenityType param is not null
    if (amenityType) { // Search_by_amenity
        rows = await searchByAmenity(rows, amenityType, amenityDist).catch(err => {
            res.status(500).json(
                {
                    message: err.message || "Some errors occured while searching for rent-out flats according to user's filters"
                }
            );
        });
        console.log("SearchByAmenity performed!");
        console.log(`${rows.length} results`);
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


// Get all rented-out flats
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

// Get a rented-out flat by id
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