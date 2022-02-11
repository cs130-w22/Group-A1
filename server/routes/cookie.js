const express = require('express');

const router = express.Router();

// get user cookie
router.get(
  '/',
  (req, res) => {
    const sessionUser = req.session.userId;
    if (req.cookies?.user == null && sessionUser != null) {
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
