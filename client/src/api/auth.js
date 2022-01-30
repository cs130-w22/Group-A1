import Cookies from "universal-cookie";
import { apiInstance, authInstance } from "../utils/axiosInstance";

export function login(email, password) {
    return authInstance.post('/login', {
        email: email,
        password: password
    })
        .then(res => res)
        .catch(err => {
            throw err;
        });
}

export function signup(email, username, password) {
    return authInstance.post('/signup', {
        email: email,
        username: username,
        password: password
    })
        .then(res => res)
        .catch(err => {
            throw err;
        });
}
const cookies = new Cookies();
export function getCookie(){
    return apiInstance.get('/cookie').then((res) => res).catch((err) => {
        console.log(err);
        return null;
    })
}