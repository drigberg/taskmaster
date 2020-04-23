const axios = require('axios');
const assert = require('assert');
const { describe, it } = require('mocha');

const db = require('../lib/db');

const BASEURL = 'http://localhost:3002';

describe('API', function () {
    beforeEach(function () {
        db._clear();
        db._populate();
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

    describe('createTask', function () {
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

    describe('updateTasks', function () {
        describe('success', function () {
            it('one task - all properties', async function () {
                const {data: originalData} = await axios.get(`${BASEURL}/api/users/lukeskywalker`);
                const taskIds = Object.keys(originalData.tasks);
                const taskId1 = taskIds[0];
                const payload = {
                    [taskId1]: {
                        name: 'updatedTask1',
                        frequency: 999
                    },
                };
                const response = await axios.post(`${BASEURL}/api/users/lukeskywalker/updateTasks`, payload);
                assert.equal(response.status, 200);
                assert.deepEqual(Object.keys(response.data), ['id', 'name', 'created', 'tasks']);
                assert.equal(response.data.name, 'Luke Skywalker');
                assert.equal(response.data.id, 'lukeskywalker');
                assert.equal(Object.keys(response.data.tasks).length, taskIds.length);

                const actual = response.data.tasks[taskId1];
                const expected = {
                    ...originalData.tasks[taskId1],
                    ...payload[taskId1]
                };
                assert.deepEqual(actual, expected);
                Object.values(originalData.tasks).filter(task => task.id !== taskId1).forEach((task) => {
                    assert.deepEqual(task, response.data.tasks[task.id]);
                });
            });

            it('one task - one property', async function () {
                const {data: originalData} = await axios.get(`${BASEURL}/api/users/lukeskywalker`);
                const taskIds = Object.keys(originalData.tasks);
                const taskId1 = taskIds[0];
                const payload = {
                    [taskId1]: {
                        frequency: 999
                    },
                };
                const response = await axios.post(`${BASEURL}/api/users/lukeskywalker/updateTasks`, payload);
                assert.equal(response.status, 200);
                assert.deepEqual(Object.keys(response.data), ['id', 'name', 'created', 'tasks']);
                assert.equal(response.data.name, 'Luke Skywalker');
                assert.equal(response.data.id, 'lukeskywalker');
                assert.equal(Object.keys(response.data.tasks).length, taskIds.length);

                const actual = response.data.tasks[taskId1];
                const expected = {
                    ...originalData.tasks[taskId1],
                    ...payload[taskId1]
                };
                assert.deepEqual(actual, expected);
                Object.values(originalData.tasks).filter(task => task.id !== taskId1).forEach((task) => {
                    assert.deepEqual(task, response.data.tasks[task.id]);
                });
            });
        });

        describe('error', function () {
            it('returns 404 for nonexistent user', async function () {
                let error = null;
                try {
                    await axios.post(`${BASEURL}/api/users/leiaskywalker/updateTasks`, {});
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 404);
            });
        });
    });


    describe('addTaskCompletion', function () {
        describe('success', function () {
            it('new date', async function () {
                const {data: originalData} = await axios.get(`${BASEURL}/api/users/lukeskywalker`);
                const taskId = Object.keys(originalData.tasks)[0];
                
                const payload = {
                    taskId,
                    completionDate: '2030-02-03'
                };
                const response = await axios.post(`${BASEURL}/api/users/lukeskywalker/addTaskCompletion`, payload);
                assert.equal(response.status, 200);
                assert.deepEqual(Object.keys(response.data), ['id', 'name', 'created', 'tasks']);
                assert.equal(response.data.name, 'Luke Skywalker');
                assert.equal(response.data.id, 'lukeskywalker');

                const actual = response.data.tasks[taskId].completionDates;
                const expected = [
                    ...originalData.tasks[taskId].completionDates,
                    payload.completionDate
                ];
                assert.deepEqual(actual, expected);
            });

            it('date already in list', async function () {
                const {data: originalData} = await axios.get(`${BASEURL}/api/users/lukeskywalker`);
                const taskId = Object.keys(originalData.tasks)[0];
                
                const payload = {
                    taskId,
                    completionDate: '2020-04-10'
                };
                const response = await axios.post(`${BASEURL}/api/users/lukeskywalker/addTaskCompletion`, payload);
                assert.equal(response.status, 200);
                assert.deepEqual(Object.keys(response.data), ['id', 'name', 'created', 'tasks']);
                assert.equal(response.data.name, 'Luke Skywalker');
                assert.equal(response.data.id, 'lukeskywalker');

                const actual = response.data.tasks[taskId].completionDates;
                const expected = originalData.tasks[taskId].completionDates;
                assert.deepEqual(actual, expected);
            });
        });

        describe('error', function () {
            it('returns 404 for nonexistent user', async function () {
                let error = null;
                try {
                    await axios.post(`${BASEURL}/api/users/leiaskywalker/addTaskCompletion`, {});
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 404);
            });

            it('returns 404 for nonexistent task', async function () {
                let error = null;
                try {
                    await axios.post(
                        `${BASEURL}/api/users/lukeskywalker/addTaskCompletion`,
                        { taskId: 'abc123', completionDate: '2020-04-01' });
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 400);
            });
        });
    });
});

