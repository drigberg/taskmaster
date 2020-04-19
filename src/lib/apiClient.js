
import axios from 'axios';

class ApiClient {
    async _fetchUserData(userId) {
        const response = await axios.get(`/api/users/${userId}`);
        return response.data;
    }
}

export default new ApiClient();
