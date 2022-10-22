const express = require('express');

const router = express.Router();

const usersControllers = require('../controllers/users_controller');
router.get('/profile',usersControllers.profile);

module.exports = router;