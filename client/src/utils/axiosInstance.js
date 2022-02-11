import axios from 'axios';

const axiosConfig = {
  baseURL: '/api',
  timeout: 30000,
};
// axios instance for login/signup
const authInstance = axios.create(axiosConfig);

// axios instance for api calls
const apiInstance = axios.create(axiosConfig);

// Add a response interceptor
apiInstance.interceptors.response.use((response) => response, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  if (error?.response?.status === 401) {
    // invalid session/expired session
    // localStorage.clear();
    console.error('invalid session');
  }
  return Promise.reject(error);
});

export { apiInstance, authInstance };
