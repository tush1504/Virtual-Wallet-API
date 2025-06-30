const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  referenceId: { type: String, unique: true }, // For tracking each transaction 
  groupId: { type: String }, 
  type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true }, // ✅ NEW: shows if money was sent or received
  payGateway: { type: String, default: 'INTERNAL' }, // ✅ Optional: useful if later you also support Razorpay etc.
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'success' },
  amount: { type: Number, required: true },
  description: { type: String }, // ✅ NEW: e.g., "Transfer to Tushar" or "Received from Rahul"
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ NEW: who sent the money
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ NEW: who received the money
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Keeps backward compatibility
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
