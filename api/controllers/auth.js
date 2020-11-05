const { tryHandler } = require("./helper");
const User = require("../../db/models/user");
const {
  sendBadRequest,
  createdResponse,
  successResponse,
  sendNoContent,
} = require("../responses");
const { setToken } = require("../../redis/api");
const logger = require("../../pkg/logger");
const { generateToken } = require("../../pkg/jwt");
const { RedisClient } = require("redis");

/**
 * @description This is  responsible for signing up user.
 * it will create a new user record if an existing record is not associated with the username
 * @param  {Request} req - request object
 * @param {Response} res - response object
 */
module.exports.signUpUser = tryHandler(async (req, res) => {
  const { username, lastname, name, password, age } = req.body;

  const foundUser = await User.findOne({ username });

  if (foundUser) {
    logger.log("warn", "username is not available");
    return res.status(409).send("username not available");
  }

  const user = new User({
    username,
    lastname,
    name,
    password,
    age,
  });

  const newUser = await user.save();

  logger.log("info", "creating account for user ...");
  return createdResponse(res, generateToken(newUser._doc));
});

/**
 * @description This is  responsible for logging in user.
 * it will check the user record from database if it matches the credentials provided by the user from request body
 * @param  {Request} req - request object
 * @param {Response} res - response object
 */
module.exports.loginUser = tryHandler(async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await User.findOne({ username });
  if (!foundUser) {
    logger.log("warn", "user account not found");
    return sendBadRequest(res, "invalid login credentials");
  }

  const isMatch = await foundUser.isMatchPassword(password);

  if (!isMatch) {
    logger.log("warn", "username does not match password for user ");
    return sendBadRequest(res, "invalid login credentials");
  }

  logger.info("generating token for user ...");
  return successResponse(res, generateToken(foundUser._doc));
});

/**
 * @description This will logout user
 *  by blacklisting the user token and setting the expiry to when the token is supposed to expire
 * @param  {RedisClient} client
 */
module.exports.logOutUser = (client) =>
  tryHandler(async (req, res) => {
    const {
      token: { raw, decoded },
    } = req;

    const expiry = decoded.exp - new Date().getTime() / 1000;

    setToken(client, raw, Math.round(expiry));

    logger.info("token blacklisted successfully...");
    return sendNoContent(res);
  });
