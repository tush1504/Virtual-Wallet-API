const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

exports.getBalance = async (req,res,next)=>{
  try{
    const wallet = await Wallet.findOne({ user: req.user.id });
    res.json({ balance: wallet.balance, accountNumber: wallet.accountNumber });
  }catch(err){ next(err); }
};

exports.internalTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderId = req.user.id;
    const { contact, amount } = req.body;

    if (!contact || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Contact and valid amount are required' });
    }

    const numericAmount = Number(amount);

    const sender = await User.findById(senderId).session(session);
    const receiver = await User.findOne({ contact }).session(session);

    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Receiver not found' });
    }

    if (sender.id === receiver.id) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot transfer to self' });
    }

    const senderWallet = await Wallet.findOne({ user: senderId }).session(session);
    const receiverWallet = await Wallet.findOne({ user: receiver._id }).session(session);

    if (!senderWallet || !receiverWallet) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Wallet not found for sender or receiver' });
    }

    if (senderWallet.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Perform balance transfer
    receiverWallet.balance = Number(receiverWallet.balance) + numericAmount;
    senderWallet.balance = Number(senderWallet.balance) - numericAmount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    // Log transactions
    const base = Date.now();
    const random = Math.floor(Math.random() * 1000);

    const debitRef = `txn_${base}_${random}_DEBIT`;
    const creditRef = `txn_${base}_${random}_CREDIT`;

    const groupId = `txn_${base}_${random}`;

    await Transaction.create([
      {
        referenceId: debitRef,
        groupId : groupId,
        type: 'DEBIT',
        payGateway: 'wallet-internal',
        status: 'success',
        amount,
        description: `Transferred to ${receiver.contact}`,
        sender: sender._id,
        receiver: receiver._id,
        user: sender._id
      },
      {
        referenceId: creditRef,
        groupId : groupId,
        type: 'CREDIT',
        payGateway: 'wallet-internal',
        status: 'success',
        amount,
        description: `Received from ${sender.contact}`,
        sender: sender._id,
        receiver: receiver._id,
        user: receiver._id
      }
    ], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Transfer successful', groupId });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Transfer failed:', err);
    res.status(500).json({ error: 'Internal server error during transfer' });
  }
};


