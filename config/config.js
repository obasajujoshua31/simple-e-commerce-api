require("dotenv").config();

const {
  APP_PORT,
  DATABASE_URL,
  DATABASE_NAME,
  DB_USER,
  DB_PASSWORD,
  NODE_ENV,
  JWT_SECRET_KEY,
  REDIS_URL,
} = process.env;

// Application configuration
module.exports = {
  redisUrl: REDIS_URL,
  appPort: APP_PORT,
  dbName: DATABASE_NAME,
  dbUser: DB_USER,
  dbPassword: DB_PASSWORD,
  env: NODE_ENV,
  jwtSecret: JWT_SECRET_KEY,
  dBUrl: DATABASE_URL,
};
