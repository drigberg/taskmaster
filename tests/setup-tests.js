
/**
 * Module dependencies
 */

const {before} = require('mocha');

const {createApp, startServer, stopServer} = require('../lib/app.js');
const {logger, LEVELS} = require('../lib/logger');

/**
 * Module
 */

logger.setLogLevel(LEVELS.SILENCE);

let server;

before(async () => {
    const app = createApp();
    server = await startServer(app, 3002);
});

after(async () => {
    await stopServer(server);
});
