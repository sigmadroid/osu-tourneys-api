const express = require('express');
const { validateSchema } = require('./validator');
const { getSchedulesSchema } = require('./schemas');
const scheduleService = require('../service/schedule');

const router = express.Router();

/**
 * /v1/tourneys/schedule
 */
router.get('/schedule', async(req, res, next) => {
    const { month } = req.query;
    const utcOffset = Number(req.query.utcOffset);
    const year = Number(req.query.year);
    const validationErrors = validateSchema(getSchedulesSchema, { month, utcOffset, year });
    if (validationErrors.length) {
        return res.status(400).json(validationErrors);
    }

    try {
        const result = await scheduleService.getSchedules(month, year, utcOffset);
        return res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
    
});

module.exports = router;
