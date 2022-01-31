import { apiInstance } from '../utils/axiosInstance';

const BASE = '/users';
export function getUser(id) {
  const url = `${BASE}/${id}`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getUserByUsername(username) {
  const url = `${BASE}/username/${username}`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getUserByEmail(email) {
  const url = `${BASE}/email/${email}`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getUserGroups(id) {
  const url = `${BASE}/${id}/groups`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}
