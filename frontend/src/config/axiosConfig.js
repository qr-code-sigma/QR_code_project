import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://qr-code-project.up.railway.app/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
});

let csrfToken = null;

instance.interceptors.request.use(
    async function (config) {
        if (!csrfToken) {
            try {
                const res = await axios.get('https://qr-code-project.up.railway.app/api/v1/auth/csrf-token/', {
                    withCredentials: true,
                });
                csrfToken = res.data.csrfToken;
            } catch (error) {
                console.error('Помилка отримання CSRF-токена', error);
            }
        }

        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;

