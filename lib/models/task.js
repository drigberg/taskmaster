/**
 * Module dependencies
 */

const uuid = require('uuid');
const dynamodb = require('../db/dynamodb_client');
const {queueAsyncFunctions} = require('../util');

/**
 * Module
 */

const ATTRIBUTE_NAME_SUBSTITUTIONS = {
    name: '#NAME'
};

class TaskData {
    constructor(id, userId, name, frequency, completionDates, archived) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.frequency = frequency;
        this.completionDates = completionDates;
        this.archived = archived;
    }

    static create(userId, name, frequency) {
        return new TaskData(uuid.v4(), userId, name, frequency, [], false);
    }

    static fromDynamoDb(data) {
        const expectedKeys = ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived'];
        expectedKeys.forEach((key) => {
            if (!Object.keys(data).includes(key)) {
                throw new Error(`Missing key for task: ${key}`);
            }
        });

        if (Object.keys(data).length != expectedKeys.length) {
            throw new Error(`Expected task data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
        }

        return new TaskData(
            data.id.S,
            data.userId.S,
            data.name.S,
            data.frequency.N,
            data.completionDates.L.map(item => item.S),
            data.archived.BOOL);
    }

    static partialToDynamoDB(userId, taskId, data) {
        // TODO: add helper methods to dynamodb client, use in forEach
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

    toDynamoDB() {
        return {
            id: {
                S: this.id
            },
            userId: {
                S: this.userId
            },
            name: {
                S: this.name
            },
            frequency: {
                N: String(this.frequency)
            },
            completionDates: {
                L: this.completionDates.map(date => ({ S: date }))
            },
            archived: {
                BOOL: this.archived
            }
        };
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            name: this.name,
            frequency: this.frequency,
            completionDates: this.completionDates,
            archived: this.archived,
        };
    }
}

class Task {
    /**
     * Fetches all tasks in scope
     */
    static async list(userId) {
        // TODO: separate model and db logic
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
        console.log(response);
        return response.Items.map(item => TaskData.fromDynamoDb(item));
    }

    /**
     * Fetches task data
     * @param {String} userId - user id
     * @param {String} taskId - task id
     */
    static async getById(userId, taskId) {
        // TODO: separate model and db logic
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
        // TODO: handle errors
        return TaskData.fromDynamoDb(response.Item);
    }
    
    static async create(userId, data) {
        // TODO: validate userId in authorization
        const taskData = TaskData.create(userId, data.name, data.frequency);
        const payload = taskData.toDynamoDB();
        await dynamodb.putItem({
            TableName: 'Tasks',
            Item: payload
        }).promise();
        // TODO: handle errors
        return taskData;
    }

    static async update(userId, taskId, data) {
        // TODO: validate userId in authorization
        const payload = TaskData.partialToDynamoDB(userId, taskId, data);

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
        // TODO: handle errors
        const taskData = await this.getById(userId, taskId);
        return taskData;
    }

    static async updateMany(userId, updatesByTaskId) {
        const that = this;
        const fns = Object.entries(updatesByTaskId)
            .map(([taskId, data]) => that.update.bind(that, userId, taskId, data));
        await queueAsyncFunctions(fns, 10);
        // TODO: handle errors
    }

    static async addCompletionDate(userId, taskId, completionDate) {
        // NOTE: we accept a completion date as an argument because
        // we don't want the date to be affected by the server timezone --
        // if it's 2020-04-20 in the user's timezone, it should be logged
        // as such. This approach could be messy if the user often takes international
        // flights going west near midnight, but it's close enough for the purposes of this app.

        // TODO: enforce chronological order
        // TODO: validate data.userId in authorization
        let taskData = await this.getById(userId, taskId);
        if (!taskData.completionDates.includes(completionDate)) {
            taskData.completionDates.push(completionDate);
            taskData = await this.update(userId, taskId, { completionDates: taskData.completionDates });
        }

        // TODO: handle errors
        return taskData;
    }
}


/**
 * Module exports
 */

module.exports = {
    Task,
    TaskData,
};
