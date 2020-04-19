/**
 * Module dependencies
 */
const {createApp, startServer} = require('./app.js');
const populateStore = require('./store/populateStore');
const {logger, LEVELS} = require('./logger');
const {DEFAULT_TOPICS}= require('./domain/arxiv');

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
        return populateStore(DEFAULT_TOPICS);
    })
    .then((numArticles) => {
        logger.info(`Successfully populated store with ${numArticles} articles`);
    })
    .catch((err) => {
        logger.info('Error on server start:', err);
        process.exit(1);
    });
