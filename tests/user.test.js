const axios = require('axios');
const assert = require('assert');
const fs = require('fs');
const { describe, it } = require('mocha');
const path = require('path');

const {User} = require('../lib/models');

const BASEURL = 'http://localhost:3002';

const TESTDATA_DIR = path.join(__dirname, 'testdata');
const testUsers = JSON.parse(fs.readFileSync(path.join(TESTDATA_DIR, 'users.json'), 'utf8'));

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
    this.users = [];
    beforeEach(async function () {
        await User.removeAll();
        const newUser = await User.create(testUsers[0]);
        this.users = [newUser];
    });

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

