const razorpay = require('../config/razorpay');
const verifySig = require('../utils/verifyRazorpaySignature');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet'); 
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


exports.createOrder = async (req,res,next)=>{
  try{

    const { amount } = req.body;

    const options = {
      amount: amount*100,  // amount in paisa chahiye razorpay me
      currency:'INR',
      receipt: crypto.randomBytes(10).toString('hex') //Random receipt ID for tracking. Not strictly necessary.
    };

    const order = await razorpay.orders.create(options); //create order in razorpay

    await Transaction.create({
      referenceId: order.id,
      payGateway:'razorpay',
      status:'pending',
      type:'CREDIT',
      amount,
      user:req.user.id
    });

    res.json({ orderId: order.id, amount });

  }catch(err){ next(err); }
};

exports.createPaymentLink = async(req,res,next) => {
  try {
     
     const {orderId} = req.body;

     if(!orderId) return res.status(400).json({ message:'Order ID is required' });

     const txn = await Transaction.findOne({referenceId:orderId});

     if(!txn) return res.status(404).json({ message:'Transaction not found' });

     const amount = txn.amount;

     const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: "INR",
      description: "Wallet Top-up",
      notes: {
        transactionId: txn._id.toString(),
        userId: txn.user.toString()
      }
    });

    res.status(200).json({
      msg:"Payment Link Created",
      paymentLink:paymentLink.short_url
    })


  } catch (error) {
    next(error);
  } 
}


exports.webhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];

    const isValid = verifySig(req.rawBody, signature);
    if (!isValid) return res.status(400).json({ message: 'Invalid signature' });

    const payload = JSON.parse(req.rawBody);

    if (payload.event === 'payment.captured') {

      const paymentEntity = payload.payload.payment.entity;

      const transactionId = paymentEntity.notes?.transactionId;
      if (!transactionId) {
        return res.status(400).json({ message: 'Missing transaction reference' });
      }

      const txn = await Transaction.findById(transactionId).populate('user', 'email');

      if (!txn) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      if (txn.status === 'pending') {
        txn.status = 'success';
        await txn.save();
        await Wallet.updateOne({ user: txn.user }, { $inc: { balance: txn.amount } });
        
        if (txn.user?.email) {
          await sendEmail(txn.user.email, 'Wallet Deposit Successful', `₹${txn.amount} added to your wallet.`);
        } else {
          console.warn("Email not sent: user email is missing");
        }
        
      }
    }

    res.json({ status: 'ok', msg: 'Money credited successfully' });

  } catch (err) {
    next(err);
  }
};
