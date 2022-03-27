const moment = require('moment');
const stagesData = require('../data/stages');
const tourneysData = require('../data/tourneys');
const timeData = require('../data/time');

const fn = {
    getSchedules
};

module.exports = fn;

/**
 * Get tournament schedules for a given month and utc offset
 * @param {string} month name of month
 * @param {number} utcOffset utc offset of the requester
 * @returns {Promise<Object>} list of schedules
 */
async function getSchedules(month, year, utcOffset) {
    const { start, end } = timeData.getPeriodDates(month, year, 'month', utcOffset);
    const stages = await stagesData.getStagesByDate(start, end).lean();

    if (!stages.length) return [];

    // Build stages array map by tourney id.
    const stagesMap = {};
    stages.forEach(stage => {
        const tourneyId = stage.tourney.toString();
        stagesMap[tourneyId] = stagesMap[tourneyId] || [];
        stagesMap[tourneyId].push({
            _id: stage._id,
            name: stage.name,
            // Change dates to utc offset of the requester
            begin: moment(stage.begin).utc().add(utcOffset, 'minutes').toISOString(),
            end: moment(stage.end).utc().add(utcOffset, 'minutes').toISOString(),
        });
    });

    // Get tourneys data.
    const tourneyIds = stages.reduce((set, stage) => set.add(stage.tourney.toString()), new Set());
    const tourneys = await tourneysData.getTourneys(Array.from(tourneyIds)).lean();

    // Add stages for each tourney.
    return tourneys.map(tourney => ({
        ...tourney,
        stages: stagesMap[tourney._id.toString()]
    }));
}
