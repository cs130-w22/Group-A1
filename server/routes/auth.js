/** Express router providing authentication check related routes
 * @module routers/auth
 * @requires express
 */

/**
 * Check for session authentication before forwarding
 * @param {express.Request} req.session - Current user session
 * @param {string} req.session.userId - User ID
 */
module.exports = (req, res, next) => {
  // check for session authentication before forwarding
  if (req.session == null || req.session.userId == null) { return res.sendStatus(401); }
  return next();
};
