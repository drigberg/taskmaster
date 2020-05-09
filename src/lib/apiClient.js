
import axios from 'axios';

class ApiClient {
    // TODO: abstract token logic, with refresh

    constructor() {
        this.idToken = '';
    }

    async getIdToken(authorizationCode) {
        const response = await axios.get('/api/auth/getToken', {
            headers: {
                Authorization: `Bearer ${authorizationCode}`
            }
        });
        // accessToken is also returned, but we don't use it now,
        // as we only have one type of user
        return response.data.idToken;
    }

    updateIdToken(idToken) {
        this.idToken = idToken;
        return this;
    }

    parseTask(data) {
        return {
            id: data.id,
            name: data.name,
            frequency: data.frequency,
            archived: data.archived,
            completionDates: data.completionDates
        };
    }

    async fetchUserData() {
        const response = await axios.get('/api/users/whoami', {
            headers: {
                Authorization: `Bearer ${this.idToken}`
            }
        });

        return {
            id: response.data.id,
            name: response.data.name,
        };
    }

    async fetchTasks() {
        const that = this;
        const response = await axios.get('/api/tasks', {
            headers: {
                Authorization: `Bearer ${this.idToken}`
            }
        });
        return response.data.map(item => that.parseTask(item));
    }

    async createTask(payload) {
        const response = await axios.post('/api/tasks', payload, {
            headers: {
                Authorization: `Bearer ${this.idToken}`
            }
        });
        return this.parseTask(response.data);
    }

    async updateTask(taskId, payload) {
        const response = await axios.post(`/api/tasks/${taskId}`, payload, {
            headers: {
                Authorization: `Bearer ${this.idToken}`
            }
        });
        return this.parseTask(response.data);
    }

    async updateTasksBulk(payload) {
        await axios.post('/api/tasks/updateBulk', payload, {
            headers: {
                Authorization: `Bearer ${this.idToken}`
            }
        });
    }

    async addTaskCompletionDate(taskId, dateString) {
        const response = await axios.post(
            `/api/tasks/${taskId}/addCompletionDate`,
            { 
                completionDate: dateString,
            }, {
                headers: {
                    Authorization: `Bearer ${this.idToken}`
                }
            });
        return this.parseTask(response.data);
    }
}

export default new ApiClient();
