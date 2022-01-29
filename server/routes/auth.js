const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.headers.authorization == null) return res.sendStatus(401);
    const token = req.headers.authorization.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.jwt_SECRET, function(err, decoded) {
        if (err) {
            if (err.name = "TokenExpiredError")
                return res.sendStatus(401);
            console.log(err);
            return res.sendStatus(500);
        }
        // continue to next middleware/route iff user id in request matches id in token 
        const userId = decoded._id;
        if (!req.body._id || req.body._id !== userId) {
            return res.sendStatus(401);
        } else {
            next();
        }
    });
};