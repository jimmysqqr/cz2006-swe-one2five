const dbConn = require('../config/dbConfig');

const getHDB = async (block, street_name) => {
    return dbConn.promise().execute(`SELECT * FROM hdb_property_info WHERE blk_no = '${block}' AND street = '${street_name}'`);
}

module.exports = getHDB;