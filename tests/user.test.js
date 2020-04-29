const axios = require('axios');
const assert = require('assert');
const fs = require('fs');
const { describe, it } = require('mocha');
const path = require('path');

const {User} = require('../lib/models');

const BASEURL = 'http://localhost:3002';

const TESTDATA_DIR = path.join(__dirname, 'testdata');
const testUsers = JSON.parse(fs.readFileSync(path.join(TESTDATA_DIR, 'users.json'), 'utf8'));

describe('Users', function () {
    this.users = [];
    beforeEach(async function () {
        await User.removeAll();
        const newUser = await User.create(testUsers[0]);
        this.users = [newUser];
    });

    describe('GET /api/users/:id', function () {
        describe('success', function () {
            it('returns data for user', async function () {
                const response = await axios.get(`${BASEURL}/api/users/${this.users[0].id}`);
                assert.equal(response.status, 200);
                assert.deepEqual(Object.keys(response.data), ['id', 'name', 'created']);
                assert.deepEqual(response.data, this.users[0]);
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
});

