import { apiInstance, authInstance } from '../utils/axiosInstance';

export function login(email, password) {
  return authInstance.post('/login', {
    email,
    password,
  })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function signup(email, username, password) {
  return authInstance.post('/signup', {
    email,
    username,
    password,
  })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}
export function getCookie() {
  return apiInstance.get('/cookie').then((res) => res).catch((err) => {
    console.log(err);
    return null;
  });
}
