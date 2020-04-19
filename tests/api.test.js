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
                const response = await axios.get(`${BASEURL}/users/lukeskywalker`);
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
                    await axios.get(`${BASEURL}/users/leiaskywalker`);
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 404);
            });
        });
    });
});

