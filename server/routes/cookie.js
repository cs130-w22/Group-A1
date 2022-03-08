/** Express router providing cookie related routes
 * @module routers/cookie
 * @requires express
 */

const express = require('express');

const router = express.Router();

/**
 * Retrieve user cookie
 * @name GET/cookie/
 * @function
 * @memberof module:routers/cookie
 * @inner
 * @param {express.Request} req.session - Current user session
 * @param {String} req.session.userId - Session User ID
 * @param {express.Request} req.cookies - Current session cookies
 * @param {String} req.cookies.user - Cookie User ID
 * @return {express.Response} Session Cookie
 * */
// get user cookie
router.get(
  '/',
  (req, res) => {
    const sessionUser = req.session.userId;
    if (req.cookies.user == null && sessionUser != null) {
      res.cookie(
        'user',
        sessionUser,
        {
          maxAge: 24 * 60 * 60,
          httpOnly: false,
        },
      ).status(200);
    }
    return res.sendStatus(204);
  },
);

module.exports = router;
