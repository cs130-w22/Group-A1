/* eslint-disable camelcase */
import { apiInstance } from '../utils/axiosInstance';

const BASE = '/polls';
export function createPoll(event, question, maxOptionId, votesAllowed, addOptionEnabled) {
  const url = `${BASE}/`;
  return apiInstance.post(
    url,
    {
      event,
      question,
      maxOptionId,
      votesAllowed,
      addOptionEnabled,
    },
  )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getPolls() {
  const url = `${BASE}/`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function getPoll(id) {
  const url = `${BASE}/${id}`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function addOption(pollId, text) {
  const url = `${BASE}/${pollId}/options`;
  return apiInstance.post(
    url,
    { text },
  )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function deleteOption(optionId) {
  const url = `${BASE}/options/${optionId}`;
  return apiInstance.delete(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function deletePoll(pollId) {
  const url = `${BASE}/${pollId}`;
  return apiInstance.delete(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function updateOption(optionId, data) {
  const url = `${BASE}/options/${optionId}`;
  return apiInstance.patch(
    url,
    { update: data },
  )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function updatePoll(pollId, data) {
  const url = `${BASE}/${pollId}`;
  return apiInstance.patch(
    url,
    { update: data },
  )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

// toggles vote
export function voteOption(optionId) {
  const url = `${BASE}/vote`;
  return apiInstance.post(
    url,
    { optionId },
  )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}
