import axios from 'axios';

const API_BASE_URL = 'https://hiring-dev.internal.kloudspot.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expired or invalid
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('user');
//             window.location.href = '/';
//         }
//         return Promise.reject(error);
//     }
    // res => res,
    // err => Promise.reject(err)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem('authToken');
    const url = error.config?.url || '';

    const isAuthCall = url.includes('/auth/login');

    if (status === 401 && token && !isAuthCall) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // SPA-safe redirect
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    return Promise.reject(
      error.response?.data?.message || 'Request failed'
    );
  }
);


export default api;
