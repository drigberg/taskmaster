/**
 * Module dependencies
 */

// load environment variables into process.env
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const dynamodb = require('../dynamodb_client');
const {logger, LEVELS} = require('../../logger');
const {queueAsyncFunctions} = require('../../util');

/**
 * Module 
 */

logger.setLogLevel(LEVELS.DEBUG);
const DUMMY_DATA_DIR = path.join(__dirname, '..', 'dummy_data');

const dummyUsers = JSON.parse(fs.readFileSync(path.join(DUMMY_DATA_DIR, 'users.json'), 'utf8'));
const dummyTasks = JSON.parse(fs.readFileSync(path.join(DUMMY_DATA_DIR, 'tasks.json'), 'utf8'));


function putItem(params) {
    return dynamodb.putItem(params).promise();
} 

async function putUsers() {
    const that = this;
    const fns = dummyUsers.map((user) => {
        const params = {
            TableName: 'Users',
            Item: {
                id: {
                    S: user.id
                },
                name: {
                    S: user.name
                },
                created: {
                    S: user.created
                },
            }
        };
        return putItem.bind(that, params);
    });
    await queueAsyncFunctions(fns, 10);
}

async function putTasks() {
    const that = this;
    const fns = dummyTasks.map((task) => {
        const params = {
            TableName: 'Tasks',
            Item: {
                id: {
                    S: task.id
                },
                userId: {
                    S: task.userId
                },
                name: {
                    S: task.name
                },
                frequency: {
                    N: String(task.frequency)
                },
                completionDates: {
                    L: task.completionDates.map(date => ({ S: date }))
                },
                archived: {
                    BOOL: task.archived
                }
            }
        };
        return putItem.bind(that, params);
    });
    await queueAsyncFunctions(fns, 10); 
}

async function task() {
    try {
        logger.info('Creating users...');
        await putUsers();
        logger.info('Successfully put users!');
    } catch(err) {
        logger.error(`Error creating users: ${err}`);
        process.exit(1);
    }
    try {
        logger.info('Creating tasks...');
        await putTasks();
        logger.info('Successfully put tasks!');
    } catch(err) {
        logger.error(`Error creating tasks: ${err}`);
        process.exit(1);
    }
}

task()
    .then(() => {
        logger.info('Successfully populated db with dummy data!');
    });
