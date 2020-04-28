/**
 * Module dependencies
 */

const uuid = require('uuid');
const dynamodb = require('../db/dynamodb_client');

/**
 * Module
 */

class UserData {
    constructor(id, name, created) {
        this.id = id;
        this.name = name;
        this.created = created;
    }

    static create(name) {
        const nowISO = new Date().toISOString();
        return new UserData(uuid.v4(), name, nowISO);
    }

    static fromDynamoDb(data) {
        const expectedKeys = ['id', 'name', 'created'];
        expectedKeys.forEach((key) => {
            if (!Object.keys(data).includes(key)) {
                throw new Error(`Missing key for user: ${key}`);
            }
        });

        if (Object.keys(data).length != expectedKeys.length) {
            throw new Error(`Expected user data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
        }

        return new UserData(data.id.S, data.name.S, data.created.S);
    }

    toDynamoDB() {
        return {
            id: {
                S: this.id
            },
            name: {
                S: this.name
            },
            created: {
                S: this.created
            },
        };
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
        };
    }
}

class User {
    static async create(data) {
        // TODO: validate userId in authorization
        const userData = UserData.create(data.name);
        const payload = userData.toDynamoDB();
        await dynamodb.putItem({
            TableName: 'Users',
            Item: payload
        }).promise();
        // TODO: handle errors
        return userData;
    }

    /**
     * Fetches user data
     * @param {String} userId - user id
     */
    static async getById(userId) {
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
        const user = UserData.fromDynamoDb(response.Item);
        return user;
    }

    static async removeAll() {
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

        // TODO: handle errors 
    }
}

/**
 * Module exports
 */

module.exports = {
    User,
    UserData
};
