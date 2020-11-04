const { RedisClient } = require("redis");
const logger = require("../pkg/logger");

/**
 * @description This is responsible for checking the redis database to find the token provided
 * @param  {RedisClient} client  - redisClient instance
 * @param  {string} token - token to be checked if blacklisted
 * @returns {Promise}
 */
module.exports.getToken = (client, token) => {
  return new Promise((resolve, reject) => {
    client.get(token, (err, result) => {
      if (err) reject(err);

      if (result) {
        logger.warn("token found in blacklisted");
        reject(new Error(result));
      }

      logger.info("token not found ...");
      resolve(true);
    });
  });
};

/**
 * @description This will create a key value pair in redis database and expire it at expiry
 * @param  {RedisClient} client - redis client instance
 * @param  {string} token - token to blacklisted
 * @param  {number} expiry - time to expire in seconds
 */
module.exports.setToken = (client, token, expiry) => {
  client.setex(token, expiry, "blacklisted token");
};
