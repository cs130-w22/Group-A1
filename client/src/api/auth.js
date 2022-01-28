import axios from 'axios';

export function login(email, password) {
    axios
        .post('/login', {
            email: email,
            password: password
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err)
            return null;
        });
}

export function signup(email, username, password) {
    axios
    .post('/signup', {
        email: email,
        username: username,
        password: password
    })
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        console.log(err)
        return null;
    });
}
