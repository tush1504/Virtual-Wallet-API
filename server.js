require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { redisClient } = require('./config/redis');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const crypto = require('crypto');
const helmet = require("helmet");
const YAML=require('yamljs');
const swaggerUi=require('swagger-ui-express');
const path = require("path")


// routes
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const walletRoutes = require('./routes/walletRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transRoutes = require('./routes/transRoutes');

const app = express();
app.use(cors());
app.use(express.json({ verify: (req,res,buf)=>{ req.rawBody = buf } }));
app.use(helmet())


// Construct the absolute path to your Swagger YAML file
const swaggerFilePath = path.resolve(__dirname,'swagger.yaml');
// Load your Swagger YAML file
const swaggerDocument = YAML.load(swaggerFilePath);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

// rate limiter for OTP
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many OTP requests, please try again later.'
});
app.use('/api/otp', otpLimiter);

// health for render
app.get("/healthz" , (req,res) =>{
  res.status(200).send("OK")
})

// controllers
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(()=>{
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
