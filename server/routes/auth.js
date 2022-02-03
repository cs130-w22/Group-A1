const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // check for session authentication before forwarding
  if (req.session == null)
    return res.sendStatus(401);
  next();
};