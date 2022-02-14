module.exports = (req, res, next) => {
  // check for session authentication before forwarding
  if (req.session == null || req.session.userId == null) { return res.sendStatus(401); }
  return next();
};
