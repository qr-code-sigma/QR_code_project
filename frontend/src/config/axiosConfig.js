import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://qr-code-project.up.railway.app/api/v1',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: true
  });

export default instance;