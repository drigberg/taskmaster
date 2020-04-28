const axios = require('axios');
const assert = require('assert');
const fs = require('fs');
const { describe, it } = require('mocha');
const path = require('path');

const {Task} = require('../lib/models/task');
const {User} = require('../lib/models/user');

const BASEURL = 'http://localhost:3002';

const TESTDATA_DIR = path.join(__dirname, 'testdata');

const testUsers = JSON.parse(fs.readFileSync(path.join(TESTDATA_DIR, 'users.json'), 'utf8'));
const testTasks = JSON.parse(fs.readFileSync(path.join(TESTDATA_DIR, 'tasks.json'), 'utf8'));

describe('Tasks', function () {
    beforeEach(async function () {
        await Task.removeAll();
        await User.removeAll();
        await User.create(testUsers[0]);
    });

    describe('POST /api/tasks', function () {
        describe('success', function () {
            it('returns data for newly created task', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency
                };
                const {data} = await axios.post(`${BASEURL}/api/tasks`, payload);
                assert.equal(data.name, testTasks[0].name);
                assert.equal(data.frequency, testTasks[0].frequency);
                assert.equal(data.archived, false);
                assert.deepEqual(data.completionDates, []);
                assert.deepEqual(Object.keys(data), ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived']);
            });
        });
    });

    describe('POST /api/tasks/:id', function () {
        describe('success', function () {
            it('updates name and frequency', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency
                };
                const {data: newTask} = await axios.post(`${BASEURL}/api/tasks`, payload);
                const updates = {
                    name: 'NEWNAME',
                    frequency: 9999
                };
                const {data} = await axios.post(`${BASEURL}/api/tasks/${newTask.id}`, updates);
                assert.equal(data.id, newTask.id);
                assert.equal(data.name, updates.name);
                assert.equal(data.frequency, updates.frequency);
                assert.equal(data.archived, false);
                assert.deepEqual(data.completionDates, []);
                assert.deepEqual(Object.keys(data), ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived']);
            });

            it('updates only name', async function () {
                const payload = {
                    name: testTasks[0].name,
                    frequency: testTasks[0].frequency
                };
                const {data: newTask} = await axios.post(`${BASEURL}/api/tasks`, payload);
                const updates = {
                    name: 'NEWNAME',
                };
                const {data} = await axios.post(`${BASEURL}/api/tasks/${newTask.id}`, updates);
                assert.equal(data.id, newTask.id);
                assert.equal(data.name, updates.name);
                assert.equal(data.frequency, testTasks[0].frequency);
                assert.equal(data.archived, false);
                assert.deepEqual(data.completionDates, []);
                assert.deepEqual(Object.keys(data), ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived']);
            });
        });
    });
});

