/**
 * Module dependencies
 */
const {createApp, startServer} = require('./app.js');
const {logger, LEVELS} = require('./logger');
const db = require('./db');

/**
 * Module
 */

logger.setLogLevel(LEVELS.DEBUG);

const PORT = process.env.PORT || 3001;
const app = createApp();

// start server and populate db
startServer(app, PORT)
    .then(() => {
        logger.info(`App is running on port ${PORT}`);
    })
    .catch((err) => {
        logger.info(`Error on server start: ${err}`);
        process.exit(1);
    });
