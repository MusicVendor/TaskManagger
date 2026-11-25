const express = require('express');
const router = express.Router();
const logoutController = require('../controller/logoutController');

router.post('/', logoutController.handleLogout);
router.get('/', logoutController.handleLogout);

module.exports = router;