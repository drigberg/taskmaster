
import axios from 'axios';

class ApiClient {
    parseTask(data) {
        return {
            id: data.id,
            name: data.name,
            frequency: data.frequency,
            archived: data.archived,
            completionDates: data.completionDates
        };
    }

    async fetchUserData(userId) {
        const response = await axios.get(`/api/users/${userId}`);
        return {
            id: response.data.id,
            name: response.data.name,
            created: response.data.created,
        };
    }

    async fetchTasks() {
        const that = this;
        const response = await axios.get('/api/tasks');
        return response.data.map(item => that.parseTask(item));
    }

    async createTask(payload) {
        const response = await axios.post('/api/tasks', payload);
        return this.parseTask(response.data);
    }

    async updateTask(taskId, payload) {
        const response = await axios.post(`/api/tasks/${taskId}`, payload);
        return this.parseTask(response.data);
    }

    async updateTasksBulk(payload) {
        const that = this;
        const response = await axios.post('/api/tasks/updateBulk', payload);
        return response.data.map(item => that.parseTask(item));
    }

    async addTaskCompletionDate(taskId, dateString) {
        const response = await axios.post(
            `/api/tasks/${taskId}/addCompletionDate`,
            { 
                completionDate: dateString,
            });
        return this.parseTask(response.data);
    }
}

export default new ApiClient();
