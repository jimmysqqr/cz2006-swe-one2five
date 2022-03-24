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
};

// Method to get a rented-out flat by id
RentedOutFlat.getById = (id, result) => {
    dbConn.query(`SELECT * FROM rentedoutflats WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log(err)
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found rented-out flat: ", res);
            result(null, res);
            return;
        }
        console.log("No rented-out flat with id", id)
        result({kind: "not_found"}, null);
    })
};

// Method to get all rented-out flats
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

// Method to search for rented-out flats based on town, flat_type, and price
RentedOutFlat.search = (town, flatType, loPrBound, hiPrBound, result) => {
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

    dbConn.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        console.log("Search performed!")
        result(null, res);
    });
}

module.exports = RentedOutFlat;