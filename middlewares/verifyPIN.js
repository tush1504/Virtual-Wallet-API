const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const Wallet = require('../models/Wallet');

const verifyPin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: 'Transaction PIN is required' });
    }

    const wallet = await Wallet.findOne({ user: userId });
   

    const isMatch = (pin === wallet.pin);
  
    if (!isMatch) {
      return res.status(403).json({ error: 'Invalid Transaction PIN' });
    }

    next(); // PIN verified, allow transfer
  } catch (err) {
    console.error('PIN verification failed:', err);
    res.status(500).json({ error: 'Internal server error during PIN verification' });
  }
};

module.exports = verifyPin;
