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
const client = dynamodb.DocumentClient;
const DUMMY_DATA_DIR = path.join(__dirname, '..', 'dummy_data');

const dummyUsers = JSON.parse(fs.readFileSync(path.join(DUMMY_DATA_DIR, 'users.json'), 'utf8'));
const dummyTasks = JSON.parse(fs.readFileSync(path.join(DUMMY_DATA_DIR, 'tasks.json'), 'utf8'));


function putItem(client, params) {
    return client.put(params).promise();
} 

async function putUsers() {
    const fns = dummyUsers.map((user) => {
        const params = {
            TableName: 'Users',
            Item: user
        };
        return putItem.bind(client, params);
    });
    await queueAsyncFunctions(fns, 10);
}

async function putTasks() {
    const fns = dummyTasks.map((task) => {
        const params = {
            TableName: 'Tasks',
            Item: task
        };
        return putItem.bind(client, params);
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
        logger.info('Task complete!');
    });
