const {calcDistance} = require('./googleMapsTool');

/**
 * Function to calculate the driving distance between a Flat and a Custom Location
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const calcCusLocDist = async (req, res) => {
    const distanceRes = await calcDistance([req.query.flatLat, req.query.flatLng], req.query.dst);
    if (distanceRes.status == 200) {
        res.status(200).json({
            distance: distanceRes.data
        });
    }
    else if (distanceRes.status == 400) {
        res.status(400).json({
            message: `Input error for calculating distance from flat to cusLoc`
        });
    }
    else {
        res.status(500).json({
            message: `Server error while calculating distance from flat to cusLoc`
        });
    }
}

module.exports = calcCusLocDist;