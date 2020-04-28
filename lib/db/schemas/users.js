/**
 * Module dependencies
 */

const dynamodb = require('../dynamodb_client');

/**
 * Module
 */

const schema = {
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

function toDynamoDB(data) {
    return {
        id: {
            S: data.id
        },
        name: {
            S: data.name
        },
        created: {
            S: data.created
        },
    };
}

function fromDynamoDb(data) {
    const expectedKeys = ['id', 'name', 'created'];
    expectedKeys.forEach((key) => {
        if (!Object.keys(data).includes(key)) {
            throw new Error(`Missing key for user: ${key}`);
        }
    });

    if (Object.keys(data).length != expectedKeys.length) {
        throw new Error(`Expected user data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
    }

    return {
        id: data.id.S,
        name: data.name.S,
        created: data.created.S
    };
}

async function removeAll() {
    if (process.env.TESTING !== 'TRUE') {
        throw new Error('Can only remove all users in testing!');
    }

    const scanResponse = await dynamodb.scan({
        TableName: 'Users'
    }).promise();
    
    const ids = scanResponse.Items.map(item => item.id);
    
    await dynamodb.batchWriteItem({
        RequestItems: {
            Users: ids.map(userId => ({
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

async function getById(userId) {
    const response = await dynamodb.getItem({
        TableName: 'Users',
        Key: {
            id: {
                S: userId
            }
        }
    }).promise();
    if (!response.Item) {
        const error = new Error(`User with id ${userId} not found`);
        error.httpStatusCode = 404;
        throw error;
    }
    return fromDynamoDb(response.Item);
}

async function create(data) {
    const payload = toDynamoDB(data);
    await dynamodb.putItem({
        TableName: 'Users',
        Item: payload
    }).promise();
}

/**
 * Module exports
 */

module.exports = {
    schema,
    create,
    fromDynamoDb,
    getById,
    removeAll
};
