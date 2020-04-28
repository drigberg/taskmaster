/**
 * Module dependencies
 */

const dynamodb = require('../dynamodb_client');

/**
 * Module
 */

const schema = {
    TableName : 'Tasks',
    KeySchema: [       
        { AttributeName: 'userId', KeyType: 'HASH'},
        { AttributeName: 'id', KeyType: 'RANGE'},
    ],
    AttributeDefinitions: [       
        { AttributeName: 'userId', AttributeType: 'S'},
        { AttributeName: 'id', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    }
};


function fromDynamoDb(data) {
    const expectedKeys = ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived'];
    expectedKeys.forEach((key) => {
        if (!Object.keys(data).includes(key)) {
            throw new Error(`Missing key for task: ${key}`);
        }
    });

    if (Object.keys(data).length != expectedKeys.length) {
        throw new Error(`Expected task data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
    }

    return {
        id: data.id.S,
        userId: data.userId.S,
        name: data.name.S,
        frequency: data.frequency.N,
        completionDates: data.completionDates.L.map(item => item.S),
        archived: data.archived.BOOL
    };
}

async function getTaskById(userId, taskId) {
    const response = await dynamodb.getItem({
        TableName: 'Tasks',
        Key: {
            userId: {
                S: userId
            },
            id: {
                S: taskId
            },
        }
    }).promise();
    if (!response.Item) {
        const error = new Error(`Task with id ${taskId} not found for user ${userId}`);
        error.httpStatusCode = 404;
        throw error;
    }
    return fromDynamoDb(response.Item);
}


async function listTasksForUser(userId) {
    const response = await dynamodb.query({
        ExpressionAttributeValues: {
            ':v1': {
                S: userId
            }
        }, 
        TableName: 'Tasks',
        Select: 'ALL_ATTRIBUTES',
        KeyConditionExpression: 'userId = :v1'
    }).promise();
    return response.Items.map(item => fromDynamoDb(item));
}


async function removeAll() {
    if (process.env.TESTING !== 'TRUE') {
        throw new Error('Can only remove all tasks in testing!');
    }

    const scanResponse = await dynamodb.scan({
        TableName: 'Tasks'
    }).promise();

    const ids = scanResponse.Items.map(item => item.id);

    await dynamodb.batchWriteItem({
        RequestItems: {
            Tasks: ids.map(userId => ({
                DeleteRequest: {
                    Key: {
                        id: {
                            S: userId
                        }
                    }
                }
            }))
        }
    });
}

/**
 * Module exports
 */

module.exports = {
    schema,
    fromDynamoDb,
    getTaskById,
    listTasksForUser,
    removeAll,
};
