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

/**
 * Module exports
 */

module.exports = {
    schema
};
