import { apiInstance } from '../utils/axiosInstance';

const BASE = '/event';

export function createEvent(body) {
  const url = `${BASE}/`;
  return apiInstance
    .post(url, body)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getEvent(id) {
  const url = `${BASE}/${id}`;
  return apiInstance
    .get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getEventPolls(id) {
  const url = `${BASE}/${id}/polls`;
  return apiInstance
    .get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function joinEvent(id) {
  const url = `${BASE}/${id}/join`;
  return apiInstance
    .post(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function leaveEvent(id) {
  const url = `${BASE}/${id}/leave`;
  return apiInstance
    .post(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getAvailability(id) {
  const url = `${BASE}/${id}/availability`;
  return apiInstance
    .get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getUserAvailability(id, userId) {
  const url = `${BASE}/${id}/availability/${userId}`;
  console.log(url);
  return apiInstance
    .get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function changeAvailability(id, selected, deselected) {
  const url = `${BASE}/${id}/availability`;
  return apiInstance
    .post(url, { selected, deselected })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}
