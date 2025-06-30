const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  contact: { type: String, unique: true },
  password: String,
  gender: String,
  dob: Date,
  publicId: { type: String, unique: true },
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
