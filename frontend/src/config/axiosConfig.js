import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);


function getCsrfToken() {
    // Fetch CSRF token from backend if not present
    if (!document.querySelector('meta[name="csrf-token"]')) {
      axios.get('http://localhost:8000/api/v1/auth/csrf-token', { withCredentials: true })
        .then(response => {
          const csrfToken = response.data.csrfToken;
          const metaTag = document.createElement('meta');
          metaTag.name = 'csrf-token';
          metaTag.content = csrfToken;
          document.head.appendChild(metaTag);
        });
    }
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  }

export default instance;