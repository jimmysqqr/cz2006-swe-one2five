const {getHDB, town_legend} = require('../models/HDB');

const lookup = (req, res) => {
    // Check if input is empty
    if (!req.body) {
        res.status(400).json({
            message: "Input cannot be empty!"
        });
        return;
    }

    // Check if the inputted HDB address is valid
    const [rows, fields] = await getHDB(req.body.block, req.body.street_name).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: `Error occurred while checking for valid HDB address`
        });
    });
    if (!rows.length) {
        console.log(`Blk ${req.body.block} ${req.body.street_name} is an invalid HDB address`);
        res.status(400).json({
            message: "Invalid HDB address!"
        });
        return;
    }
    else {
        console.log(`Blk ${req.body.block} ${req.body.street_name} is a valid HDB address`);
    }
    
    // Getting the Target Flat's town
    const town_code = rows[0].bldg_contract_town;
    const town = town_legend[town_code];

    // Getting the Target Flat's coors
    // Getting nearby amenities of the Target Flat
    // View aggregated price 
    // Pass all info back to frontend
}

module.exports = lookup;