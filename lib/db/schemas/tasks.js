/**
 * Module dependencies
 */

const dynamodb = require('../dynamodb_client');

/**
 * Module
 */

const ATTRIBUTE_NAME_SUBSTITUTIONS = {
    name: '#NAME'
};

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

function toDynamoDBFromPartialJSON(userId, taskId, data) {
    // TODO: merge with toDynamoDBFromJSON method
    const payload = {
        userId: {
            S: userId
        },
        id: {
            S: taskId
        }
    };
    const providedKeys = Object.keys(data);
    if (providedKeys.includes('name')) {
        payload.name = { S: data.name };
    }
    if (providedKeys.includes('frequency')) {
        payload.frequency = { N: String(data.frequency) };
    }
    if (providedKeys.includes('completionDates')) {
        payload.completionDates = {
            L: data.completionDates.map(date => ({ S: date }))
        };
    }
    if (providedKeys.includes('archived')) {
        payload.archived = { BOOL: data.archived };
    }
    return payload;
}

function toDynamoDBFromJSON(data) {
    return {
        id: {
            S: data.id
        },
        userId: {
            S: data.userId
        },
        name: {
            S: data.name
        },
        frequency: {
            N: String(data.frequency)
        },
        completionDates: {
            L: data.completionDates.map(date => ({ S: date }))
        },
        archived: {
            BOOL: data.archived
        }
    };
}

function toJSONfromDynamoDB(data) {
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
    return toJSONfromDynamoDB(response.Item);
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
    return response.Items.map(item => toJSONfromDynamoDB(item));
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

async function put(data) {
    const payload = toDynamoDBFromJSON(data);
    await dynamodb.putItem({
        TableName: 'Tasks',
        Item: payload
    }).promise();
}

async function update(userId, taskId, data) {
    const payload = toDynamoDBFromPartialJSON(userId, taskId, data);

    // assign key-value pairs to attribute value identifiers, and
    // map reserved attribute names to substitutions
    const expressionAttributeNames = {};
    const expressionMapping = Object.entries(payload)
        .filter(([attribute]) => !['id', 'userId'].includes(attribute))
        .map(([attribute, value], index) => {
            let attributeName = attribute;
            if (Object.keys(ATTRIBUTE_NAME_SUBSTITUTIONS).includes(attribute)) {
                attributeName = ATTRIBUTE_NAME_SUBSTITUTIONS[attribute];
                expressionAttributeNames[attributeName] = attribute;
            }
            return {
                expressionKey: `:v${index}`,
                attribute: attributeName,
                value
            };
        });

    // build update body
    const expressionAttributeValues = expressionMapping.reduce((acc, mapping) => {
        acc[mapping.expressionKey] = mapping.value;
        return acc;
    }, {});
    const updateExpressionParts = expressionMapping
        .map(mapping => `${mapping.attribute}=${mapping.expressionKey}`);
    const updateExpression = `SET ${updateExpressionParts.join(', ')}`;

    const updateItemPayload = {
        TableName: 'Tasks',
        Key: {
            id: payload.id,
            userId: payload.userId
        },
        ExpressionAttributeValues: expressionAttributeValues,
        UpdateExpression: updateExpression
    };

    if (Object.keys(expressionAttributeNames).length > 0) {
        updateItemPayload.ExpressionAttributeNames = expressionAttributeNames;
    }

    await dynamodb.updateItem(updateItemPayload).promise();
}

/**
 * Module exports
 */

module.exports = {
    schema,
    put,
    getTaskById,
    listTasksForUser,
    removeAll,
    toJSONfromDynamoDB,
    toDynamoDBFromPartialJSON,
    toDynamoDBFromJSON,
    update,
};
