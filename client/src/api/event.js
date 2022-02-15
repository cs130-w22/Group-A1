import { apiInstance } from '../utils/axiosInstance';

const BASE = '/event';

export function createEvent(body) {
  const url = `${BASE}/`;
  return apiInstance.post(url, body)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getEvent(id) {
  const url = `${BASE}/${id}`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getEventPolls(id) {
  const url = `${BASE}/${id}/polls`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function joinEvent(id) {
  const url = `${BASE}/${id}/members`;
  return apiInstance.post(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}
