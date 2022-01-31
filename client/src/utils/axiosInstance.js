import axios from 'axios';

// axios instance for login/signup
const authInstance = axios.create();

// axios instance for api calls
const apiInstance = axios.create();

// // Add a request interceptor
// apiInstance.interceptors.request.use(function (req) {
//     console.log("Request intercepted");
//     return req;
// }, function (error) {
//     return Promise.reject(error);
// });

// // Add a response interceptor
// apiInstance.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     console.log("Response intercepted");
//     return response;
// }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     return Promise.reject(error);
// });

export { apiInstance, authInstance };
