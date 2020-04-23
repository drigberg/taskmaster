/**
 * Module dependencies
 */

// load environment variables into process.env
require('dotenv').config();

const dynamodb = require('../dynamodb_client');
const {logger, LEVELS} = require('../../logger');

/**
 * Module 
 */

logger.setLogLevel(LEVELS.DEBUG);


function listTables() {
    logger.info('Checking if tables already exist...');
    return new Promise((resolve, reject) => {
        dynamodb.listTables((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.TableNames);
            }
        });
    });
}

function createUsersTable() {
    logger.info('Creating users table...');

    return new Promise((resolve, reject) => {
        const usersTableParams = {
            TableName : 'Users',
            KeySchema: [       
                { AttributeName: 'id', KeyType: 'HASH'},
            ],
            AttributeDefinitions: [       
                { AttributeName: 'id', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };
    
        dynamodb.createTable(usersTableParams, function(err, data) {
            if (err) {
                reject(`Unable to create users table. Error JSON: ${JSON.stringify(err, null, 2)}`);
            } else {
                resolve(JSON.stringify(data, null, 2));
            }
        });
    });
}

function createTasksTable() {
    logger.info('Creating tasks table...');

    return new Promise((resolve, reject) => {
        const tasksTableParams = {
            TableName : 'Tasks',
            KeySchema: [       
                { AttributeName: 'id', KeyType: 'HASH'},
            ],
            AttributeDefinitions: [       
                { AttributeName: 'id', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };

        dynamodb.createTable(tasksTableParams, function(err, data) {
            if (err) {
                reject(`Unable to create tasks table. Error JSON: ${JSON.stringify(err, null, 2)}`);
            } else {
                resolve(`Created tasks table. Table description JSON: ${JSON.stringify(data, null, 2)}`);
            }
        });
    });
}

async function task() {
    const tables = await listTables();
    logger.info(`Existing tables: ${JSON.stringify(tables)}`);
    if (tables.includes('Users')) {
        logger.info('Users table already created!');
    } else {
        await createUsersTable();
    }

    if (tables.includes('Tasks')) {
        logger.info('Tasks table already created!');
    } else {
        await createTasksTable();
    }
}

task()
    .then(() => {
        logger.info('Task complete!');
        process.exit(0);
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });