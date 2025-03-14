const express = require('express');
const { register, login, getuser } = require('../controllers/authController');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/getuser', getuser)
module.exports = router;