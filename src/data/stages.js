const { Stage } = require('./models');

/**
 * Retrieve stages that begin or end in a specific date range
 * @param {string} from earliest date to search (inclusive)
 * @param {string} to latest date to search (inclusive)
 * @param {string} fields fields to include in result, empty for all fields
 * @returns {Promise<Object>} a Mongoose query object
 */
function getStagesByDate(from, to, fields = []) {
    const query = {
        $or: [
            { begin: { $gte: from, $lte: to } },
            { end: { $gte: from, $lte: to } }
        ]
    };

    return Stage.find(query).select(fields.join(' '));
};

const fn = {
    getStagesByDate
};

module.exports = fn;
