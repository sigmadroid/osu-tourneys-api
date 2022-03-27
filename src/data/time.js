const moment = require('moment');

const fn = {
    getPeriodDates
};

module.exports = fn;

function getPeriodDates(month, year, period = 'month', utcOffset = 0) {
    const time = moment().utc().year(year).month(month);
    const start = time.clone().startOf(period).subtract(utcOffset, 'minutes').toISOString();
    const end = time.clone().endOf(period).subtract(utcOffset, 'minutes').toISOString();

    return { start, end };
}