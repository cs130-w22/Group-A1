const jwt = require('jsonwebtoken');

exports.accessToken = function(user) {
    const token_body = {
        id: user.id,
        email: user.email,
        username: user.username
    }
    const accessToken = jwt.sign({ user: token_body }, process.env.SECRET, { expiresIn: '3m' });
    return accessToken;
    // const refreshToken = jwt.sign({ user: token_body }, process.env.SECRET, { expiresIn: '6h'});
    // return {"accessToken": accessToken, "refreshToken": refreshToken}
}

exports.userCookie = {
    maxAge: 24*60*60,
    httpOnly: false,
    sameSite: true
}