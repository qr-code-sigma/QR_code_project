import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://67c59545351c081993fa9a3b.mockapi.io/api/v1',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

export default instance;