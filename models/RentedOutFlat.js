const dbConn = require('../config/dbConfig');

// Attributes of RentedOutFlat object
const RentedOutFlat = (rentedoutflat) => {
    this.id = rentedoutflat.id;
    this.rental_approval_date = rentedoutflat.rental_approval_date;
    this.town = rentedoutflat.town;
    this.block = rentedoutflat.block;
    this.street_name = rentedoutflat.street_name;
    this.flat_type = rentedoutflat.flat_type;
    this.monthly_rent = rentedoutflat.monthly_rent;
    this.latitude = rentedoutflat.latitude;
    this.longitude = rentedoutflat.longitude;
};

/**
 * Method to get a rented-out flat by id
 * 
 * @param {number|string} id 
 * @returns {Promise}
 */
RentedOutFlat.getById = async (id) => {
    return dbConn.promise().execute(`SELECT * FROM rentedoutflats WHERE id = ${id}`);
};

/**
 * Method to get all rented-out flats
 * 
 * @param {*} result 
 */
RentedOutFlat.getAll = (result) => {
    dbConn.query('SELECT * FROM rentedoutflats', (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        console.log("All rented-out flats fetched")
        result(null, res);
    })
};

/**
 * Method to search for rented-out flats based on town, flat_type, and price
 * 
 * @param {string} town 
 * @param {string} flatType 
 * @param {number|string} loPrBound 
 * @param {number|string} hiPrBound 
 * @returns {Promise}
 */
RentedOutFlat.search = async (town, flatType, loPrBound, hiPrBound) => {
    // Handle the search filters
    let sql = "SELECT * FROM rentedoutflats";
    if (town || flatType || loPrBound || hiPrBound) {
        sql += " WHERE";
    }
    else {
        console.log("All rented-out flats fetched")
    }
    if (town) {
        min_1_filter = true;
        sql += ` town LIKE '%${town}%'`;
    }
    if (flatType) {
        sql += ` AND flat_type LIKE '%${flatType}%'`;
    }
    if (loPrBound) {
        sql += ` AND monthly_rent >= ${loPrBound}`;
    }
    if (hiPrBound) {
        sql += ` AND monthly_rent <= ${hiPrBound}`;
    }
    sql = sql.replace("WHERE AND", "WHERE");

    // Perform the database query
    return dbConn.promise().execute(sql);
}

module.exports = RentedOutFlat;