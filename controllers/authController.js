const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Profile = require('../models/Profile');
const generateAccountNumber = require('../utils/generateAccountNumber');
const generatePin = require('../utils/generatePin');
const generatePublicId = require('../utils/generatePublicId');
const CustomError = require('../utils/customError');
const { redisClient } = require('../config/redis');

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, contact, gender, dob } = req.body;

    // Check if mobile is verified (Redis)
    const redisKey = `verified:mobile:${contact}`;
    const isMobileVerified = await redisClient.get(redisKey);
    console.log(isMobileVerified)
    
    if (!isMobileVerified) throw new CustomError('Mobile number not verified', 400);

    // Check for existing user
    if (await User.findOne({ email })) throw new CustomError('Email already exists', 400);
    if (await User.findOne({ contact })) throw new CustomError('Contact already exists', 400);


    // Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      contact,
      publicId: generatePublicId(),
      gender,
      dob
    });

    // Create Wallet
    await Wallet.create({
      balance: 0,
      accountNumber: generateAccountNumber(),
      pin: generatePin(),
      user: user._id
    });

    // Create Profile with isMobileVerified=true (from Redis)
    await Profile.create({
      user: user._id,
      isMobileVerified: true,
      isEmailVerified: false
    });

    // Clean up Redis flag after successful signup
    await redisClient.del(redisKey);


    res.json({ message: 'User created successfully . Please verify your emailId to Login' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Invalid credentials', 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new CustomError('Invalid credentials', 401);

    const profile = await Profile.findOne({ user: user._id });
    if (!profile || !profile.isEmailVerified || !profile.isMobileVerified) {
      throw new CustomError('Please verify email and mobile first', 403);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });

  } catch (err) {
    next(err);
  }
};


