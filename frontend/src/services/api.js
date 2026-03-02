import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { removeFromLocalStorage } from '../utils/commonFunctions/removeFromLocalStorage';

const PUBLIC_ENDPOINTS = [
  '/login',
  '/register',
  '/refresh-token',
];

const isPublicEndpoint = (url = '') => {
  return PUBLIC_ENDPOINTS.some((endpoint) =>
    url.includes(endpoint)
  );
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "content-type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  async (response) => {

    if (isPublicEndpoint(response.config.url)) {
      return response;
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken?.exp * 1000 < Date.now()) {
          removeFromLocalStorage();
          window.location.href = '/login';
        }
      } catch (err) {
        removeFromLocalStorage();
        window.location.href = '/login';
      }
    }

    return response;
  },
  async (error) => {
    const url = error.config?.url;

    if (isPublicEndpoint(url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      removeFromLocalStorage();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;