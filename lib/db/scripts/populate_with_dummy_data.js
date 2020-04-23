/**
 * Module dependencies
 */

// load environment variables into process.env
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const dynamodb = require('../dynamodb_client');
const {logger, LEVELS} = require('../../logger');

/**
 * Module 
 */

logger.setLogLevel(LEVELS.DEBUG);
const client = new dynamodb.DocumentClient();
const DUMMY_DATA_DIR = path.join(__dirname, 'dummy_data');

const dummyUsers = JSON.parse(fs.readFileSync(path.join(DUMMY_DATA_DIR, 'users.json'), 'utf8'));
const dummyTasks = JSON.parse(fs.readFileSync(path.join(DUMMY_DATA_DIR, 'tasks.json'), 'utf8'));

dummyUsers.forEach((user) => {
    const params = {
        TableName: 'Users',
        Item: user
    };

    client.put(params, function(err) {
        if (err) {
            logger.error(`Unable to add user with name ${user.name}. Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
            logger.log(`PutItem succeeded for user with name ${user.name}`);
        }
    });
});

dummyTasks.forEach((task) => {
    const params = {
        TableName: 'Tasks',
        Item: task
    };

    client.put(params, function(err) {
        if (err) {
            logger.error(`Unable to add task with name ${task.name}. Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
            logger.log(`PutItem succeeded for task with name ${task.name}`);
        }
    });
});