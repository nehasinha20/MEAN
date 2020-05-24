const express = require('express')
const router = express.Router()
const loginController = require('../controllers/login.controllers');


// Create a new user
router.post('/register', loginController.register);

// Create a new user
router.post('/login', loginController.login);

module.exports = router