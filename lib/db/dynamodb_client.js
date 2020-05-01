
/**
 * Module dependencies
 */
const AWS = require('aws-sdk');

/**
 * Module
 */

// can't set custom endpoint with environment variables
if (process.env.ENV != 'PROD') {
    AWS.config.update({
        endpoint: process.env.DYNAMODB_URL
    });
}


/**
 * Module exports
 */
module.exports = new AWS.DynamoDB();
