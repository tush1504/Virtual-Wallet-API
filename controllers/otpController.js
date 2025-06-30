const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../utils/sendEmail');
const sendSms = require('../utils/sendSms');
const { redisClient } = require('../config/redis');
const User = require("../models/User")
const Profile = require("../models/Profile")
const generatePassword = require('../utils/generatePassword');
const CustomError = require('../utils/customError');
const bcrypt = require('bcrypt');
const Wallet = require('../models/Wallet');
const sendDetails = require('../utils/sendDetails');


exports.sendMobileOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: 'Invalid Indian mobile number' });
    }

    const otp = generateOtp();
    console.log(otp)

    // Save OTP to Redis with 5 min expiry
    await redisClient.set(`mobile:${mobile}`, otp, { EX: 300 });
    const check = await redisClient.get(`mobile:${mobile}`);
    console.log('OTP stored in Redis:', check); // 👈 Should log the OTP
    

    const response = await sendSms(mobile, otp);
    console.log('2Factor OTP Response:', response);

    res.status(200).json({ message: 'OTP sent to mobile number' });
  } catch (err) {
    next(err);
  }
};


exports.verifyMobileOtp = async (req, res, next) => {
  try {
    const { key, otp } = req.body;

    if (!key || !otp) {
      return res.status(400).json({ message: 'Key and OTP are required' });
    }

    // Determine type and construct Redis keys
    console.log('Verifying OTP for key:', key); 
    const redisKey = `mobile:${key}`
    const verifiedKey = `verified:mobile:${key}`

    // Fetch OTP from Redis
    const real = await redisClient.get(redisKey);
    console.log(real,otp)
    if (real === otp) {
      // OTP is correct
      await redisClient.del(redisKey);
      await redisClient.set(verifiedKey, "true", { EX: 600 }); // Set a short-lived verified flag


      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    next(err);
  }
};

exports.sendEmailOtp = async (req,res,next)=>{
  try{
    const { email } = req.body;
    const otp = generateOtp();
    await redisClient.set(`email:${email}`, otp, { EX:300 });
    await sendEmail(
      email,
      'Your Verification OTP',
       `<h2>Welcome to Fintech Wallet!</h2> <p><strong>Your OTP is:</strong> ${otp}</p>`,
    );
   
    res.json({ message:'OTP sent to email' });
  }catch(err){ next(err); }
};

exports.verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate OTP from Redis
    const redisKey = `email:${email}`;
    console.log(redisKey)
    const storedOtp = await redisClient.get(redisKey);
    console.log(storedOtp,otp)
    if (storedOtp !== otp) throw new CustomError('Invalid OTP', 400);

    // 2. Update Profile
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('User not found', 404);

    const profile = await Profile.findOne({ user: user._id });
    if (!profile) throw new CustomError('Profile not found', 404);

    profile.isEmailVerified = true;
    await profile.save();

    // 3. Generate password and hash it
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    user.password = hashedPassword;
    await user.save();

    // 4. Get wallet details
    const wallet = await Wallet.findOne({ user: user._id });

    if (!user.email || typeof user.email !== 'string' || user.email.trim() === '') {
      throw new Error('Recipient email is missing or invalid');
    }

    console.log("Trying to send wallet credentials to:", user.email);

    // 5. Send email with credentials
    await sendDetails({
      to: user.email,
      subject: 'Your Wallet Credentials',
      html: `
        <h2>Welcome to Fintech Wallet!</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Password:</strong> ${plainPassword}</p>
        <p><strong>Account Number:</strong> ${wallet.accountNumber}</p>
        <p><strong>PIN:</strong> ${wallet.pin}</p>
        <p>Please keep these credentials secure.</p>
      `
    });

    // 6. Delete OTP from Redis
    await redisClient.del(redisKey);

    res.json({ message: 'Email verified successfully. Credentials have been sent to your email.' });
  } catch (err) {
    next(err);
  }
};

