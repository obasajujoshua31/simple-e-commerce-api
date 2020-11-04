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
    const decoded = decodeToken(bearerToken);
    const token = {
      raw: bearerToken,
      decoded,
    };

    req.token = token;
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
    await getToken(client, req.token.raw);
    logger.info("user token is not blacklisted, proceeding to next handler...");
    return next();
  } catch (error) {
    logger.warn("user has logged out, unable to login");
    return sendNotAuthorized(res);
  }
};
/**
 * @description This will allow only users with role admin to proceed, 
 * this needs to happen after the user is authenticated
 * @param  {Request} req - request object
 * @param  {Response} res - response object
 * @param  {NextFunction} next
 */
module.exports.isAdmin = (req, res, next) => {
  const { token: { decoded: { role } = {} } = {} } = req;

  if (typeof role === "undefined") {
    logger.warn("forbidden to access isAdmin routes");
    return notFound(res, "not found");
  }

  if (role !== ADMINROLE) {
    logger.warn("client cannot access admin routes");
    return notFound(res, "not found");
  }

  return next();
};
