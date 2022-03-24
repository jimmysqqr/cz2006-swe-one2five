const dbConn = require('../config/dbConfig');

const isHDB = (block, street_name, result) => {
    sql = `SELECT * FROM hdb_property_info WHERE blk_no = '${block}' AND street = '${street_name}'`;
    console.log(sql)
    dbConn.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log(`Blk ${block} ${street_name} is a valid HDB address`);
            result(null, true);
            return;
        }
        console.log(`Blk ${block} ${street_name} is an invalid HDB address`);
        result(null, false);
    })
}

module.exports = isHDB;