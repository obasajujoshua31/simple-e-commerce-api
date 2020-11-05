const {
  check,
  validationResult,
  ValidationChain,
} = require("express-validator");
const { sendBadRequest } = require("../responses");
const logger = require("../../pkg/logger");

/**
 * @description - this will validate the the field is string and minimum length of number
 * @param  {string} field - the field to validate
 * @param  {Number} length - minimum expected length - default - 4
 * @returns {ValidationChain}
 */
const stringFieldCheck = (field, length = 4) =>
  check(field)
    .trim()
    .isLength({ min: length })
    .withMessage(`${field} must be greater than ${length}`);

/**
 * @description - this will validate the the field is number
 * @param  {string} field - the field to validate
 * @returns {ValidationChain}
 */
const numberFieldCheck = (field) =>
  check(field).trim().isNumeric().withMessage(`${field} is not a valid number`);

/**
 * @param  {Request} req - request object
 * @param  {Response} res - response object
 * @param  {NextFunction} next - next function
 */
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

// Validation for signup, checks username, password, name, lastname and age and validate the request
module.exports.validateSignup = [
  stringFieldCheck("username"),
  stringFieldCheck("password", 4),
  stringFieldCheck("name", 2),
  stringFieldCheck("lastname", 2),
  numberFieldCheck("age"),
  validateAndSendResponse,
];

// Validation for login, checks username, password and validate the request
module.exports.validateLogin = [
  stringFieldCheck("username"),
  stringFieldCheck("password", 4),
  validateAndSendResponse,
];

// Validation for createproduct, checks name, description, price and validate the request
module.exports.validateCreateProduct = [
  stringFieldCheck("name"),
  stringFieldCheck("description", 10),
  numberFieldCheck("price"),
  validateAndSendResponse,
];

// Validation for updateproduct, checks price is number - allows empty
// This will return error if all of description, name and price is empty.
module.exports.validateUpdateProduct = [
  check("price")
    .trim()
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Only decimals allowed"),

  validateAndSendResponse,
  (req, res, next) => {
    const { price, description, name } = req.body;

    if (!price && !description && !name) {
      return sendBadRequest(res, "invalid update request");
    }

    return next();
  },
];
