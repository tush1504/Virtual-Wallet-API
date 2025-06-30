const router = require('express').Router();
const { sendEmailOtp, sendMobileOtp, verifyMobileOtp, verifyEmailOtp } = require('../controllers/otpController');
router.post('/email', sendEmailOtp);
router.post('/mobile', sendMobileOtp);
router.post('/verify-mobile', verifyMobileOtp);
router.post('/verify-email', verifyEmailOtp);
module.exports = router;
 