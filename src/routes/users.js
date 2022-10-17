const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


router.get('/register', usersController.register);
router.post('/register', usersController.processRegister);
router.get('/login', usersController.login);
router.post('/login', usersController.processLogin);
router.get('/logout', usersController.logout);
router.get('/profile', usersController.profile);

module.exports = router;