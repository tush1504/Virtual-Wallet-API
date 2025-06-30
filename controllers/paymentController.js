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



exports.webhook = async (req,res,next)=>{

  const signature = req.headers['x-razorpay-signature']; //all webhook are signed with a secret key . this header contains it

  const isValid = verifySig(req.rawBody, signature); //this verfies that webhook is really from rpay

  if(!isValid) return res.status(400).json({ message:'Invalid signature' });

  const payload = JSON.parse(req.rawBody);


  if(payload.event === 'payment.captured'){

    const orderId = payload.payload.payment.entity.order_id; //extract the user id

    const txn = await Transaction.findOne({ referenceId: orderId }); //lokk for the pending transaction

    if(txn && txn.status==='pending'){

      txn.status = 'success'; //mark the transaction as success
      await txn.save(); //save the transaction
      // await sendEmail(txn.user.email, 'Wallet Deposit Successful', `₹${txn.amount} added to your wallet.`); 

      await Wallet.updateOne({ user: txn.user }, { $inc:{ balance: txn.amount } }); //update the wallet balance

    }
  }
  console.log("Webhook received and processed successfully");
  res.json({ status: 'ok' , msg:"Money credited successfully" });
};



