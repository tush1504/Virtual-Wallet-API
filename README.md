# 💸 Virtual Wallet API

A secure, production-grade Virtual Wallet API built with Node.js, Express.js, MongoDB, and Redis. It features robust OTP-based authentication, UPI-style transaction PIN verification, real-time wallet-to-wallet transfers, Razorpay integration for wallet top-ups, and a modular, scalable backend architecture with comprehensive error handling.

---

## 🚀 Postman Documentation

To access the public documentation of the Virtual Wallet API , you can visit my [Postman Documentation](https://documenter.getpostman.com/view/45879803/2sB34ZqPYw)
  
---

## 🚀 Features

- 🔐 **OTP-Based Authentication**
  - Email (Nodemailer + Redis) and Mobile (2Factor + Redis) verification
  - Separate OTPs for login, signup, and password/PIN reset
- 🧾 **Automatic Wallet Creation**
  - Users get a new Wallet and Profile on signup
  - Secure password and PIN generation + email delivery of credentials
- 🔁 **Wallet-to-Wallet Transfers**
  - Real-time internal transfers with balance checks
  - Atomic MongoDB transactions using sessions
  - PIN verification (UPI-style) for transaction authorization
- 💳 **Razorpay Payments**
  - Seamless wallet top-up flow using Razorpay Orders API
  - Webhook-based wallet crediting with HMAC verification
- 📊 **Transaction Logs & History**
  - Filterable transaction data by date, type, or amount
  - Full transaction trail for each user
- 🔄 **Rollback-Safe Operations**
  - Graceful error handling with session.abortTransaction()
- 📦 **Scalable Architecture**
  - Clean controller-route separation
  - Environment-based config, middleware for auth, error, and PIN checks

---

## 🧱 Tech Stack

| Layer         | Tools/Frameworks |
|---------------|------------------|
| **Backend**   | Node.js, Express.js |
| **Database**  | MongoDB + Mongoose |
| **Cache**     | Redis (OTP storage) |
| **Auth**      | JWT, Bcrypt, 2Factor, Nodemailer |
| **Payments**  | Razorpay (Webhook + Orders API) |
| **Docs & Tools** | Swagger UI, Postman |

---

## 🗂 Folder Structure
    ├── server.js
    ├── config/
    │ ├── db.js
    │ ├── razorpay.js
    │ ├── redis.js
    │ └── swagger.js
    ├── controllers/
    │ ├── authController.js
    │ ├── otpController.js
    │ ├── paymentController.js
    │ ├── transacController.js
    │ └── walletController.js
    ├── middleware/
    │ ├── auth.js
    │ ├── errorHandler.js
    │ ├── notFound.js
    │ └── verifyPIN.js
    ├── models/
    │ ├── Profile.js
    │ ├── Transaction.js
    │ ├── User.js
    │ └── Wallet.js
    ├── routes/
    │ ├── authRoutes.js
    │ ├── otpRoutes.js
    │ ├── paymentRoutes.js
    │ ├── transRoutes.js
    │ └── walletRoutes.js
    ├── utils/
    │ ├── customError.js
    │ ├── generateAccountNumber.js
    │ ├── generateOtp.js
    │ ├── generatePassword.js
    │ ├── generatePin.js
    │ ├── generatePublicId.js
    │ ├── pay.html
    │ ├── sendDetails.js
    │ ├── sendEmail.js
    │ ├── sendSms.js
    │ └── verifyRazorpaySignature.js
    │ 
    │  
    └── package.json
    └── package-lock.json
    └── swagger.yaml
    └── Virtual Wallet API.postman_collection.json
    └── .gitignore
    └── README.md


---

## 🌐 Environment Variables
   - Create a `.env` file in the root directory and add the following:
     ```env
      # MongoDB connection string
      MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yourdbname?retryWrites=true&w=majority

      # JWT secret for authentication
      JWT_SECRET=your_jwt_secret

      # Razorpay API keys
      RAZORPAY_API_KEY=your_razorpay_api_key
      RAZORPAY_KEY_SECRET=your_razorpay_secret_key

      # Razorpay Webhook secret (from Razorpay dashboard)
      RAZORPAY_WEBHOOK_SECRET=secret_for_webhook_verification

      # Redis URL (for OTP or rate limiting, etc.)
      REDIS_URL=redis://default:<password>@<host>:<port>

      # Email service credentials (e.g., Gmail or SMTP provider)
      EMAIL_USER=your_email@example.com
      EMAIL_PASS=your_email_password_or_app_password

      # TwoFactor / Fast2SMS API key for mobile OTP
      TWOFACTOR_API_KEY=api_key_for_otp

      # Port for running the server
      PORT=3000

     ```

---

## 📑 API Documentation

- 📬 **Postman Collection** 
- 🔎 **Swagger UI** 


---

## 🛡 Security Highlights

- 🔐 Hashed passwords and PINs (bcrypt)
- 🧠 OTP expiry + Redis eviction handling
- 🚨 Rate limiting and input validation
- 🛑 Protected routes using JWT
- ✅ Atomic operations for critical flows

---

## 🧪 Testing

- ✅ Manual testing via Postman and Swagger UI
- ✅ Auth flow + OTP expiration edge cases
- ✅ Razorpay webhook testing with test credit card & secret


---

## ✨ Future Enhancements

-  Add Change Password & Change PIN feature
-  Wallet to QR Payment
-  Scheduled/Recurring Payments
-  Admin Dashboard for reporting
-  Analytics for spending and deposits


---

## 👨‍💻 Author

**Tushar Kant Sahu**  
[GitHub](https://github.com/tush1504) | [LinkedIn](https://www.linkedin.com/in/tushar-kant-sahu-/)

---

## 📜 License

This project is licensed under the MIT License.
