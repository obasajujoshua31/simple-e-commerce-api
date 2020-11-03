const { check, validationResult } = require("express-validator");
const { sendBadRequest } = require("../responses");
const logger = require("../../pkg/logger");

const stringFieldCheck = (field, length = 5) =>
  check(field)
    .isLength({ min: length })
    .withMessage(`${field} must be greater than ${length}`);

const validateAndSendResponse = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.log(
      "warn",
      `request body for ${req.originalUrl} is not valid `,
      errors.array()
    );
    return sendBadRequest(res, errors.array());
  }

  return next();
};

module.exports.validateSignup = [
  stringFieldCheck("username"),
  stringFieldCheck("password", 4),
  stringFieldCheck("name", 2),
  stringFieldCheck("lastname", 2),
  check("age").isNumeric().withMessage("age should be a number"),
  validateAndSendResponse,
];

module.exports.validateLogin = [
  stringFieldCheck("username"),
  stringFieldCheck("password", 4),
  validateAndSendResponse,
];
