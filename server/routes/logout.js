const express = require('express');

const router = express.Router();

// logout and destroy session
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
