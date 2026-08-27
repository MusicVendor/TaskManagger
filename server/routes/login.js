const express = require('express');
const router = express.Router();
const {handleOAuthLogin} = require('../controller/loginController');

//router.post('/', authController.handleLogin);
router.post('/google', handleOAuthLogin);

module.exports = router;