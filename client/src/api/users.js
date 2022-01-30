import { apiInstance } from "../utils/axiosInstance";

const BASE = '/users';
export function getUser(id) {
    const url = `${BASE}/${id}`
    return apiInstance.get(url)
        .then(res => res)
        .catch(err => {
            throw err;
        });
}
