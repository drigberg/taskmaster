const axios = require('axios');
const assert = require('assert');
const { describe, it } = require('mocha');

const store = require('../lib/store');

const BASEURL = 'http://localhost:3002';

describe('API', function () {
    beforeEach(function () {
        store._clear();
        store._populate();
    });

    describe('getUserData', function () {
        describe('success', function () {
            it('returns data for user', async function () {
                const response = await axios.get(`${BASEURL}/api/users/lukeskywalker`);
                assert.equal(response.status, 200);
                assert.deepEqual(Object.keys(response.data), ['id', 'name', 'created', 'tasks']);
                assert.equal(response.data.name, 'Luke Skywalker');
                assert.equal(response.data.id, 'lukeskywalker');
            });
        });

        describe('error', function () {
            it('returns 404 for nonexistent user', async function () {
                let error = null;
                try {
                    await axios.get(`${BASEURL}/api/users/leiaskywalker`);
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 404);
            });
        });
    });

    describe('createTaskForUser', function () {
        describe('success', function () {
            it('returns updated data for user', async function () {
                const {data: originalData} = await axios.get(`${BASEURL}/api/users/lukeskywalker`);
                const existingTaskIds = Object.keys(originalData.tasks);
                const payload = {
                    name: 'newTask1',
                    frequency: 10
                };
                const response = await axios.post(`${BASEURL}/api/users/lukeskywalker/createTask`, payload);
                assert.equal(response.status, 200);
                assert.deepEqual(Object.keys(response.data), ['id', 'name', 'created', 'tasks']);
                assert.equal(response.data.name, 'Luke Skywalker');
                assert.equal(response.data.id, 'lukeskywalker');

                const updatedTaskIds = Object.keys(response.data.tasks);
                assert.equal(updatedTaskIds.length, existingTaskIds.length + 1);
                const newTaskIds = updatedTaskIds.filter(id => !existingTaskIds.includes(id));
                assert.equal(newTaskIds.length, 1);
                const newTaskId = newTaskIds[0];

                const newTask = response.data.tasks[newTaskId];
                assert.equal(newTask.name, payload.name);
                assert.equal(newTask.frequency, payload.frequency);
                assert.equal(newTask.archived, false);
                assert.deepEqual(Object.keys(newTask), ['id', 'name', 'frequency', 'completionDates', 'archived']);
            });
        });

        describe('error', function () {
            it('returns 404 for nonexistent user', async function () {
                let error = null;
                try {
                    await axios.post(`${BASEURL}/api/users/leiaskywalker/createTask`, {});
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 404);
            });
        });
    });
});

