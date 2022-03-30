const app = require('./app');
const mongo = require('./data/mongo');

// Connect to DB
mongo.connect();

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Application listening on port ${port}`);
});
