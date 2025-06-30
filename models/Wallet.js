const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  accountNumber: { type: String, unique: true },
  pin: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
});

module.exports = mongoose.model('Wallet', WalletSchema);
