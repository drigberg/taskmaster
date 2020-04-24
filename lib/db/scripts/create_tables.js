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


async function listTables() {
    logger.info('Checking if tables already exist...');
    const data = await dynamodb.listTables().promise();
    return data.TableNames;
}

async function createUsersTable() {
    logger.info('Creating users table...');

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

    const data = await dynamodb.createTable(usersTableParams).promise();
    return data;
}

async function createTasksTable() {
    logger.info('Creating tasks table...');

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

    const data = await dynamodb.createTable(tasksTableParams).promise();
    return data;
}

async function task() {
    const tables = await listTables();
    logger.info(`Existing tables: ${JSON.stringify(tables)}`);
    if (tables.includes('Users')) {
        logger.info('Users table already created!');
    } else {
        const usersTableData = await createUsersTable();
        logger.info(`Successfully created users table! Response: ${JSON.stringify(usersTableData)}`);
    }

    if (tables.includes('Tasks')) {
        logger.info('Tasks table already created!');
    } else {
        const tasksTableData = await createTasksTable();
        logger.info(`Successfully created tasks table! Response: ${JSON.stringify(tasksTableData)}`);
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