const dbConn = require('../config/dbConfig');

/**
 * Function to find a HDB block corresponding to a given address (block + street_name)
 * 
 * @param {number|string} block 
 * @param {string} street_name 
 * @returns {Promise}
 */
const getHDB = async (block, street_name) => {
    return dbConn.promise().execute(`SELECT * FROM hdb_property_info WHERE blk_no = '${block}' AND street = '${street_name}'`);
}

/**
 * List of HDB towns and their abbreviations
 */
const town_legend = {
    'AMK': 'ANG MO KIO',
    'BB': 'BUKIT BATOK',
    'BD': 'BEDOK',
    'BH': 'BISHAN',
    'BM': 'BUKIT MERAH',
    'BP': 'BUKIT PANJANG',
    'BT': 'BUKIT TIMAH',
    'CCK': 'CHOA CHU KANG',
    'CL': 'CLEMENTI',
    'CT': 'CENTRAL',
    'GL': 'GEYLANG',
    'HG': 'HOUGANG',
    'JE': 'JURONG EAST',
    'JW': 'JURONG WEST',
    'KWN': 'KALLANG/WHAMPOA',
    'MP': 'MARINE PARADE',
    'PG': 'PUNGGOL',
    'PRC': 'PASIR RIS',
    'QT': 'QUEENSTOWN',
    'SB': 'SEMBAWANG',
    'SGN': 'SERANGOON',
    'SK': 'SENGKANG',
    'TAP': 'TAMPINES',
    'TG': 'TENGAH',
    'TP': 'TOA PAYOH',
    'WL': 'WOODLANDS',
    'YS': 'YISHUN'
}

/**
 * List of flat types
 */
const flatTypes = ['1-ROOM', '2-ROOM', '3-ROOM', '4-ROOM', '5-ROOM', 'EXECUTIVE'];

module.exports = {getHDB, town_legend, flatTypes};