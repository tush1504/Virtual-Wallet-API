const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // Important for Upstash TLS
    rejectUnauthorized: false // Accept self-signed certs if any
  }
});

redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('error', err => console.error('❌ Redis error:', err));

(async () => {
  await redisClient.connect();
})();

module.exports = {redisClient}
