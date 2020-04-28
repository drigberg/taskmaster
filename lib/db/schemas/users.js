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

/**
 * Module exports
 */

module.exports = {
    schema,
    removeAll
};
