/** Express router providing logout related routes
 * @module routers/logout
 * @requires express
 */

const express = require('express');

const router = express.Router();

/**
 * Logout current user and destroy session
 * @name POST/logout
 * @function
 * @memberof module:routers/logout
 * @inner
 * @param {express.Request} req.session Request session
 */
router.post(
  '/',
  (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.clearCookie('sessionId');
      return res.sendStatus(200);
    });
  },
);

module.exports = router;
