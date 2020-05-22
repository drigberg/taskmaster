/**
 * Module dependencies
 */

const dynamodb = require('../dynamodb_client');
const {logger, LEVELS} = require('../../logger');
const schemas = require('../schemas');

/**
 * Module 
 */

logger.setLogLevel(LEVELS.DEBUG);


async function listTables() {
    logger.info('Checking if tables already exist...');
    const data = await dynamodb.listTables().promise();
    return data.TableNames;
}

async function createTasksTable() {
    logger.info('Creating tasks table...');
    const data = await dynamodb.createTable(schemas.tasks.schema).promise();
    return data;
}

async function task() {
    const tables = await listTables();
    logger.info(`Existing tables: ${JSON.stringify(tables)}`);

    if (tables.includes('Tasks')) {
        logger.info('Tasks table already created!');
    } else {
        const tasksTableData = await createTasksTable();
        logger.info(`Successfully created tasks table! Response: ${JSON.stringify(tasksTableData)}`);
    }
}

task()
    .then(() => {
        logger.info('Successfully created tables!');
        process.exit(0);
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });