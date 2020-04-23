
/**
 * Module dependencies
 */
const AWS = require('aws-sdk');

/**
 * Module
 */

AWS.config.update({
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
    region: process.env.AWS_REGION,
    endpoint: process.env.DYNAMODB_URL
});

/**
 * Module exports
 */
module.exports = new AWS.DynamoDB();
