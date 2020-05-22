const axios = require('axios');
const assert = require('assert');
const fs = require('fs');
const { describe, it } = require('mocha');
const path = require('path');

const {Task} = require('../lib/models');

const BASEURL = 'http://localhost:3002';

const TESTDATA_DIR = path.join(__dirname, 'testdata');

const testTasks = JSON.parse(fs.readFileSync(path.join(TESTDATA_DIR, 'tasks.json'), 'utf8'));

// TODO: create a helper for this
const AUTH_OPTIONS = {
    headers: {
        authorization: 'Bearer TEST_TOKEN'
    }
};

const INVALID_AUTH_OPTIONS = {
    headers: {
        authorization: 'Bearer INVALID_TOKEN'
    }
};

describe('Tasks', function () {
    beforeEach(async function () {
        await Task.removeAll();
    });

    describe('POST /api/tasks', function () {
        describe('success', function () {
            it('returns data for newly created task', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency
                };
                const {data} = await axios.post(`${BASEURL}/api/tasks`, payload, AUTH_OPTIONS);
                assert.equal(data.name, testTasks[0].name);
                assert.equal(data.frequency, testTasks[0].frequency);
                assert.equal(data.archived, false);
                assert.deepEqual(data.completionDates, []);
                assert.deepEqual(Object.keys(data), ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived']);
            });
        });

        describe('error', function () {
            it('returns 401 with invalid token', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency
                };

                let error = null;
                try {
                    await axios.post(`${BASEURL}/api/tasks`, payload, INVALID_AUTH_OPTIONS);
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 401);
            });
        });
    });

    describe('POST /api/tasks/:id', function () {
        describe('success', function () {
            it('updates all possible properties', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency,
                };
                const {data: newTask} = await axios.post(`${BASEURL}/api/tasks`, payload, AUTH_OPTIONS);
                const updates = {
                    name: 'NEWNAME',
                    frequency: 9999,
                    archived: true
                };
                const {data} = await axios.post(`${BASEURL}/api/tasks/${newTask.id}`, updates, AUTH_OPTIONS);
                assert.equal(data.id, newTask.id);
                assert.equal(data.name, updates.name);
                assert.equal(data.frequency, updates.frequency);
                assert.equal(data.archived, true);
                assert.deepEqual(data.completionDates, []);
                assert.deepEqual(Object.keys(data), ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived']);
            });

            it('updates only name', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency
                };
                const {data: newTask} = await axios.post(`${BASEURL}/api/tasks`, payload, AUTH_OPTIONS);
                const updates = {
                    name: 'NEWNAME',
                };
                const {data} = await axios.post(`${BASEURL}/api/tasks/${newTask.id}`, updates, AUTH_OPTIONS);
                assert.equal(data.id, newTask.id);
                assert.equal(data.name, updates.name);
                assert.equal(data.frequency, testTasks[0].frequency);
                assert.equal(data.archived, false);
                assert.deepEqual(data.completionDates, []);
                assert.deepEqual(Object.keys(data), ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived']);
            });
        });

        describe('error', function () {
            it('returns 401 with invalid token', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency
                };
                const {data: newTask} = await axios.post(`${BASEURL}/api/tasks`, payload, AUTH_OPTIONS);
                const updates = {
                    name: 'NEWNAME',
                };

                let error = null;
                try {
                    await axios.post(`${BASEURL}/api/tasks/${newTask.id}`, updates, INVALID_AUTH_OPTIONS);
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 401);
            });
        });
    });
});

