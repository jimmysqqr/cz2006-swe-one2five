const dbConn = require('../config/dbConfig');

// Attributes of RentedOutFlat object
const SavedFlat = function(savedflat) {
    this.id = savedflat.id;
    this.town = savedflat.town;
    this.block = savedflat.block;
    this.street_name = savedflat.street_name;
    this.flat_type = savedflat.flat_type;
    this.monthly_rent = savedflat.monthly_rent;
    this.latitude = savedflat.latitude;
    this.longitude = savedflat.longitude;
};

// Method to get all saved flats
SavedFlat.getAll = (result) => {
    dbConn.query('SELECT * FROM savedflats', (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        console.log("All saved flats fetched")
        result(null, res);
    })
};

// Method to get a saved flat by id
SavedFlat.getById = (id, result) => {
    return dbConn.promise().execute(`SELECT * FROM savedflats WHERE id = ${id}`);
};

// Method to create a new saved flat
SavedFlat.create = (newSavedFlat, result) => {
    dbConn.query(`INSERT INTO savedflats SET ?`, newSavedFlat, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newSavedFlat });
        console.log("save flat! ", { id: res.insertId, ...newSavedFlat });
    });
};

// Method to delete a saved flat
SavedFlat.remove = (id, result) => {
    dbConn.query("DELETE FROM savedflats WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log(error);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            // cannot find saved flat with the given id
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("deleted saved flat with id ", id);
        result(null, res);
    });
};

module.exports = SavedFlat;