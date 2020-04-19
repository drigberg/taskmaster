/**
 * Module dependencies
 */
const {createApp, startServer} = require('./app.js');
const {logger, LEVELS} = require('./logger');
const store = require('./store');

/**
 * Module
 */

logger.setLogLevel(LEVELS.DEBUG);

const PORT = process.env.PORT || 3001;
const app = createApp();

// start server and populate store
startServer(app, PORT)
    .then(() => {
        logger.info(`App is running on port ${PORT}`);
        logger.info('Populating store...');
        store._populate();
        logger.info('Store is populated with dummy data!');
    })
    .catch((err) => {
        logger.info('Error on server start:', err);
        process.exit(1);
    });
