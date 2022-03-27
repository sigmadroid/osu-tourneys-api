const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const tourneysRoutes = require('./routes/tourneys');
const errorHandler = require('./middleware/errorHandler');

// Express Setup
const app = express();
app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/v1/tourneys', tourneysRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError.NotFound());
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

module.exports = app;
