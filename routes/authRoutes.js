const express = require('express');
const AuthController = require('../controllers/AuthController.js');

const router = express.Router();

router.get('/login', AuthController.login);
router.get('/register', AuthController.register);
router.post('/register', AuthController.registerPost);

module.exports = router;