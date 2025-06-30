const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  isEmailVerified: { type: Boolean, default: false },
  isMobileVerified: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
