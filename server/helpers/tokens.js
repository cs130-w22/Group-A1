const jwt = require('jsonwebtoken');

exports.generateTokens = function(user) {
    const token_body = {
        _id: user._id,
        email: user.email,
        username: user.username
    }
    const accessToken = jwt.sign({ user: token_body }, process.env.JWT_SECRET, { expiresIn: '3m' });
    return accessToken;
    // const refreshToken = jwt.sign({ user: token_body }, process.env.JWT_SECRET, { expiresIn: '6h'});
    // return {"accessToken": accessToken, "refreshToken": refreshToken}
}