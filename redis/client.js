const redis = require("redis");

/**
 * @description This will get the client connection to a redis instance
 * @param  {object} config
 * @returns {redis.RedisClient}
 */
const getRedisClient = ({ redisUrl }) => {
  const client = redis.createClient({
    url: redisUrl,
  });

  client.on("error", (err) => {
    console.error("Error:  ", err);
  });

  client.once("connect", () => {
    console.log("Connected to Redis!");
  });

  return client;
};

module.exports = getRedisClient;
