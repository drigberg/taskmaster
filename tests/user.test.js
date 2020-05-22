const axios = require('axios');
const assert = require('assert');
const { describe, it } = require('mocha');


const BASEURL = 'http://localhost:3002';

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

describe('Users', function () {
    describe('GET /api/users/whoami', function () {
        describe('success', function () {
            it('returns data for user', async function () {
                const response = await axios.get(`${BASEURL}/api/users/whoami`, AUTH_OPTIONS);
                assert.equal(response.status, 200);
                assert.deepEqual(response.data, {
                    name: 'Luke',
                    id: 'lukeskywalker'
                });
            });
        });

        describe('error', function () {
            it('returns 401 with invalid token', async function () {
                let error = null;
                try {
                    await axios.get(`${BASEURL}/api/users/whoami`, INVALID_AUTH_OPTIONS);
                } catch (err) {
                    error = err;
                }
                assert.notEqual(error, null);
                assert.equal(error.response.status, 401);
            });
        });
    });
});

