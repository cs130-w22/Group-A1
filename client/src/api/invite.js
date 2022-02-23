import { apiInstance } from '../utils/axiosInstance';

export function getUserInvites(userId) {
  const url = `/users/${userId}/invites`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}
export function getEventInvites(eventId) {
  const url = `/event/${eventId}/invites`;
  return apiInstance.get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export function sendEventInvite(eventId, recipientUsername) {
  const url = '/invite';
  return apiInstance.post(url, {
    recipient: recipientUsername,
    id: eventId,
    type: 'Event',
  })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}
