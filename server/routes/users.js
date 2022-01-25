const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getUser);
router.get('/username/:username', userController.getUserByUsername);
router.get('/email/:email', userController.getUserByEmail);    
router.get('/:id/groups', userController.getUserGroups);

module.exports = router;