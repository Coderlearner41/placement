const express = require('express');
const { registerCompany, getAllCompanies } = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/createCompany', authMiddleware, registerCompany);
router.get('/all', authMiddleware, getAllCompanies);
module.exports = router;