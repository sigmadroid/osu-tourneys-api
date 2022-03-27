const { Types } = require('mongoose');
const { Tourney } = require('./models');

/**
 * Get tourneys using a list of ids
 * @param {string[]} tourneyIds a list of tourney ids to get
 * @returns {Promise<Object>} a Mongoose query object with the result
 */
function getTourneys(tourneyIds) {
    const query = {
        _id: {
            $in: tourneyIds.map(id => Types.ObjectId(id))
        }
    };

    return Tourney.find(query);
}

module.exports = {
    getTourneys
};
