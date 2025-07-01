#Virtual Wallet API

A secure, production-ready virtual wallet backend built with Node.js, Express, MongoDB, and Redis. Think of it like a simplified version of your favorite mobile payment apps — users can sign up, verify their identity, manage wallets, transfer money, and even top up using Razorpay. Everything is structured for scalability and security, with a clean codebase and solid error handling.

---

## API Documentation

  -To access the public documentation of the Virtual Wallet API , you can visit the [Postman Documentation](https://documenter.getpostman.com/view/45879803/2sB34ZqPYw)
  -Interactive docs available via Swagger UI (on /api-docs)
---

## Key Features

- OTP-Based Authentication
  -Verifies users via email (Nodemailer) and mobile (Fast2SMS / 2Factor)
  -OTPs are securely stored in Redis with expiry
  -Different OTP flows for signup, login, and password/PIN reset

- Automatic Wallet Setup
  -Every new user automatically gets a Wallet and Profile
  -Securely generates and sends password + PIN via email

- Wallet-to-Wallet Transfers
  -Real-time internal transfers with PIN verification (like UPI)
  -Balance checks and rollback-safe with MongoDB transaction sessions

- Add Money via Razorpay
  -Users can top-up wallets using Razorpay
  -Uses Razorpay’s Orders API and webhook verification to confirm success

- View Transaction History
  -Full logs for each transaction
  -Supports filtering by date, type, and amount

- Bulletproof Operations
  -Strong input validation + graceful error handling
  -Sessions auto-abort on failure — no broken balances or ghost entries
---

## Tech Stack

| Layer         | Tools/Frameworks |
|---------------|------------------|
| **Backend**   | Node.js, Express.js |
| **Database**  | MongoDB + Mongoose |
| **Cache**     | Redis (OTP storage) |
| **Auth**      | JWT, Bcrypt, 2Factor, Nodemailer |
| **Payments**  | Razorpay (Webhook + Orders API) |
| **Docs & Tools** | Swagger UI, Postman |

---

## Folder Structure
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

## Environment Variables
   - Create a `.env` file in the root directory and add the following:
     ```env
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     RAZORPAY_API_KEY=your_key
     RAZORPAY_KEY_SECRET=your_secret
     RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
     REDIS_URL=redis://default:password@host:port
     EMAIL_USER=youremail@example.com
     EMAIL_PASS=your_email_password
     TWOFACTOR_API_KEY=your_sms_api_key
     PORT=3000


     ```

---


## Security Highlights

- All passwords and PINs are hashed using bcrypt
- OTPs expire and auto-delete from Redis
- Input is sanitized and validated
- All sensitive routes are JWT-protected
- Critical flows (like transfers) use MongoDB atomic transactions

---

## Testing

- Manual testing via Postman and Swagger UI
- Auth flow + OTP expiration edge cases
- Razorpay webhook testing with test credit card & secret


---

## Future Enhancements

-  Add Change Password & Change PIN feature
-  Wallet to QR Payment
-  Scheduled/Recurring Payments Mode
-  Admin Dashboard for reports and provide statistics
-  Analytics for spending and deposits per user


---

## Author

**Tushar Kant Sahu**  
[GitHub](https://github.com/tush1504) || [LinkedIn](https://www.linkedin.com/in/tushar-kant-sahu-/)

---

## License

MIT License — free to use, build upon, and learn from. Just give credit where it’s due.
