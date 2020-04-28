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

/**
 * Module exports
 */

module.exports = {
    schema
};
