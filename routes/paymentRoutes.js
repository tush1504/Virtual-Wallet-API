const express = require('express');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createOrder, webhook } = require('../controllers/paymentController');

router.post('/create-order', auth, createOrder);
router.post('/webhook', express.raw({ type:'application/json' }), webhook);

module.exports = router;
