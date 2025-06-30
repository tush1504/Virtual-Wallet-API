const router = require('express').Router();
const auth = require('../middlewares/auth');
const verifyPIN = require('../middlewares/verifyPIN');
const { getBalance, internalTransfer } = require('../controllers/walletController');
const { getTransactionHistory } = require('../controllers/transacController');
const swaggerJSDoc = require('swagger-jsdoc');

router.post('/transfer', auth, verifyPIN, internalTransfer);
router.get('/balance', auth, getBalance);


module.exports = router;
