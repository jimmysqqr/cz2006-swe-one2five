const dbConn = require('../config/dbConfig');

// Attributes of SavedFlat object
const SavedFlat = function(savedflat) {
    this.id = savedflat.id;
    this.town = savedflat.town;
    this.block = savedflat.block;
    this.street_name = savedflat.street_name;
    this.flat_type = savedflat.flat_type;
    this.flat_status = savedflat.flat_status;
    this.monthly_rent = savedflat.monthly_rent;
    this.latitude = savedflat.latitude;
    this.longitude = savedflat.longitude;
    this.userToken = savedflat.userToken;
    this.rented_out_id = savedflat.rented_out_id;
};

// Method to get all saved flats for a userToken
SavedFlat.getAll = (userToken, result) => {
    dbConn.query(`SELECT * FROM savedflats WHERE userToken = '${userToken}'`, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        console.log("All saved flats fetched")
        result(null, res);
    })
};

// Method to get a saved flat by id for a userToken
SavedFlat.getById = async (id, userToken) => {
    return dbConn.promise().execute(`SELECT * FROM savedflats WHERE id = ${id} AND userToken = '${userToken}'`);
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

// Method to delete a saved flat of id for a userToken
SavedFlat.remove = (id, userToken, result) => {
    dbConn.query(`DELETE FROM savedflats WHERE id = ${id} AND userToken = '${userToken}'`, (err, res) => {
        if (err) {
            console.log(err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            // cannot find saved flat with the given id
            console.log(`No saved flat with id ${id}`);
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted saved flat with id ", id);
        result(null, res);
    });
};

module.exports = SavedFlat;