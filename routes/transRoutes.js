const express = require('express');
const router = express.Router();
const { getTransactionHistory, exportPDF } = require('../controllers/transacController');
const auth = require('../middlewares/auth');

router.get('/history', auth, getTransactionHistory);
router.get('/pdf', auth, exportPDF);

module.exports = router