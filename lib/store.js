/**
 * Module
 */

class Store {
    constructor() {
        this._clear();
    }

    /**
     * Fetches user data
     * @param {String} id - user id
     */
    getUserById(id) {
        if (!Object.keys(this.usersById).includes(id)) {
            const error = new Error('User not found!');
            error.httpStatusCode = 404;
            throw error;
        }
        return this.usersById[id];
    }

    _populate() {
        this.usersById['lukeskywalker'] = {
            id: 'lukeskywalker',
            name: 'Luke Skywalker',
            created: new Date('2020-03-01'),
            tasks: {
                1: {
                    'id': 1,
                    'name': 'clean R2D2',
                    'frequency': 7,
                    'completionDates': [
                        new Date('2020-04-02'),
                        new Date('2020-04-05'),
                        new Date('2020-04-10')
                    ],
                    'archived': false
                },
                2: {
                    'id': 2,
                    'name': 'clean C3PO',
                    'frequency': 7,
                    'completionDates': [
                        new Date('2020-04-02'),
                    ],
                    'archived': false
                },
                3: {
                    'id': 3,
                    'name': 'scrub the Falcon',
                    'frequency': 31,
                    'completionDates': [
                        new Date('2020-03-07'),
                    ],
                    'archived': false
                },
            }
        };
    }

    /**
     * Clears store
     */
    _clear() {
        this.usersById = {};
    }
}


/**
 * Module exports
 */


module.exports = new Store();