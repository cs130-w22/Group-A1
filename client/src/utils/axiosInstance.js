import axios from 'axios';

let base;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  base = '/api';
} else {
  base = 'https://cya-api-cs130.herokuapp.com/'
}

axios.defaults.withCredentials = true;
const axiosConfig = {
  baseURL: base,
  timeout: 30000,
};

const apiConfig = {
  baseURL: base,
  timeout: 30000,
  // withCredentials: true,
}

// axios instance for login/signup
const authInstance = axios.create(axiosConfig);


// axios instance for api calls
const apiInstance = axios.create(apiConfig);

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
