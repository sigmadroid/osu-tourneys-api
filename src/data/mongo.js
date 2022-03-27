const mongoose = require('mongoose');
const aws = require('./aws');

/**
 * Establish connection with the database
 * @returns {Promise}
 */
async function connect() {
    try {
        const credentials = await aws.getSecret('osu-tourneys/dev/mongodb');
        const {
            hostname,
            database,
            password,
            username
        } = JSON.parse(credentials);
        
        await mongoose.connect(`mongodb+srv://${username}:${password}@${hostname}/${database}?retryWrites=true&w=majority`);
        if (process.env.NODE_ENV.trim() === 'development') {
            mongoose.set('debug', true);
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error connecting to MongoDB: ${error}`);
    }
}

const fn = {
    connect
};

module.exports = fn;
