// 2factor does not give text otp for free trail . Instead they send voice otp to the mobile number
// voice otp means that you will recieve a call saying that the otp is this this this 


const axios = require('axios');

const sendSms = async (mobile, otp) => {
  try {
    const twoFactorApiKey = process.env.TWOFACTOR_API_KEY;

    const url = `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/+91${mobile}/${otp}`;

    const response = await axios.get(url);

    // Optional: check status
    if (response.data.Status !== 'Success') {
      throw new Error('OTP not sent: ' + response.data.Details);
    }

    return response.data; // Will include Details (like session ID)
  } catch (err) {
    console.error('Error sending SMS via 2Factor:', err.message);
    throw new Error('Failed to send OTP via 2Factor SMS');
  }
};

module.exports = sendSms;
