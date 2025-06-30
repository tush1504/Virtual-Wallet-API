const crypto = require('crypto');

function verifySig(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const generated = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return generated === signature;
}

module.exports = verifySig