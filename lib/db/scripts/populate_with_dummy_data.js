/**
 * Module dependencies
 */

const fs = require('fs');
const path = require('path');

const dynamodb = require('../dynamodb_client');
const {logger, LEVELS} = require('../../logger');
const {queueAsyncFunctions} = require('../../util');

/**
 * Module 
 */

logger.setLogLevel(LEVELS.DEBUG);
const TESTDATA_DIR = path.join(__dirname, '..', '..', '..', 'tests', 'testdata');

const testTasks = JSON.parse(fs.readFileSync(path.join(TESTDATA_DIR, 'tasks_for_ui.json'), 'utf8'));


function putItem(params) {
    return dynamodb.putItem(params).promise();
} 

/**
 * Converts template into date based on days before today
 * @param {String} dateTemplate - "DAYS_AGO: {N}"
 */
function dateTemplateToDateString(dateTemplate) {
    const daysAgo = parseInt(dateTemplate.split('DAYS_AGO: ')[1], 10);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateString = date.toISOString().split('T')[0];
    return dateString;
}

async function putTasks(userId) {
    const that = this;
    const fns = testTasks.map((task) => {
        const params = {
            TableName: 'Tasks',
            Item: {
                id: {
                    S: task.id
                },
                userId: {
                    S: userId
                },
                name: {
                    S: task.name
                },
                frequency: {
                    N: String(task.frequency)
                },
                completionDates: {
                    L: task.completionDates.map(dateTemplate => ({
                        S: dateTemplateToDateString(dateTemplate)
                    }))
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
    const userId = process.argv[2];
    if (!userId) {
        throw new Error('Must have userId argument');
    }
    try {
        logger.info('Creating tasks...');
        await putTasks(userId);
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
