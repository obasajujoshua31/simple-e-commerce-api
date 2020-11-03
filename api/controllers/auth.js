const { tryHandler } = require("./helper");
const User = require("../../db/models/user");
const {
  sendBadRequest,
  createdResponse,
  successResponse,
} = require("../responses");
const logger = require("../../pkg/logger");
const { generateToken } = require("../../pkg/jwt");

module.exports.signUpUser = tryHandler(async (req, res) => {
  const { username, lastname, name, password, age } = req.body;

  const foundUser = await User.findOne({ username });

  if (foundUser) {
    logger.log("warn", "username is not available");
    return sendBadRequest(res, "username is not available");
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
  return createdResponse(res, {
    token: generateToken(newUser._doc),
  });
});

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
  return successResponse(res, {
    token: generateToken(foundUser._doc),
  });
});
