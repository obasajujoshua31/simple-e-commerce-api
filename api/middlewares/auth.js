const { sendNotAuthorized, notFound } = require("../responses");
const { decodeToken } = require("../../pkg/jwt");
const logger = require("../../pkg/logger");
const { getToken } = require("../../redis/api");
const { ADMINROLE } = require("../constants/constants");
const { RedisClient } = require("redis");

/**
 * @description This is responsible for verifing user token, it returns unauthorized
 * if token is not found, or unable to decode user token for reasons like expired token, malformed tokens etc
 * it add the raw token, and the decoded token in the request object as token
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
module.exports.verifyUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (typeof token === "undefined") {
    logger.warn("user token not found");
    return sendNotAuthorized(res);
  }

  const [, bearerToken] = token.split(" ");
  if (typeof bearerToken === "undefined") {
    logger.warn("user token is not a bearer type");
    return sendNotAuthorized(res);
  }

  try {
    const decodedToken = decodeToken(bearerToken);
    const user = {
      rawToken: bearerToken,
      decodedToken,
    };

    req.user = user;
    logger.info("decoded token successfully returning to next handler...");
    return next();
  } catch (error) {
    logger.warn("token decoding failed, sending not authorized", error.message);
    return sendNotAuthorized(res);
  }
};

/**
 * @description This will check if a user is still logged in,
 * it does it by checking blacklisted tokens record from redis database instance to see
 * users that have logged out whose tokens have not expired.
 * This is a hack because jwt does not support server side invalidation of tokens
 * @param  {RedisClient} client - redis client instance
 * @param  {Request} req - request object
 * @param  {Response} res - response object
 * @param  {NextFunction} next - next function
 */

module.exports.checkIsLoggedIn = (client) => async (req, res, next) => {
  try {
    await getToken(client, req.user.rawToken);
    logger.info("user token is not blacklisted, proceeding to next handler...");
    return next();
  } catch (error) {
    logger.warn("user has logged out, unable to login");
    return sendNotAuthorized(res);
  }
};

module.exports.authRole = (role) => {
  return (req, res, next) => {
    if (req.user.decodedToken.role !== role) {
      logger.warn("action is not permitted");
      return notFound(res, "not found");
    }

    return next();
  };
};
