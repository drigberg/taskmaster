
import axios from 'axios';

class ApiClient {
    parseTasks(tasks) {
        console.log('Parsing tasks...')
        return Object.entries(tasks).reduce((acc, [id, task]) => {
            acc[id] = {
              id: task.id,
              name: task.name,
              frequency: task.frequency,
              completionDates: task.completionDates
            };
            return acc;
          }, {});
    }

    async fetchUserData(userId) {
        const response = await axios.get(`/api/users/${userId}`);
        return {
            name: response.data.name,
            created: response.data.created,
            tasks: this.parseTasks(response.data.tasks)
        };
    }

    async createTask(userId, payload) {
        const response = await axios.post(`/api/users/${userId}/createTask`, payload);
        return this.parseTasks(response.data.tasks);
    }

    async updateTasks(userId, payload) {
        const response = await axios.post(`/api/users/${userId}/updateTasks`, payload);
        return this.parseTasks(response.data.tasks);
    }
}

export default new ApiClient();
