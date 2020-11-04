const {
  OK,
  BADREQUEST,
  NOTFOUND,
  INTERNALSERVERERROR,
  CREATED,
  NOCONTENT,
  NOTAUTHORIZED,
  FORBIDDEN,
} = require("./constants/constants");

/**
 * @description This returns success response
 * @param  {Response} res
 * @param  {} data
 */
module.exports.successResponse = (res, data = {}) => {
  return res.status(OK).json(data);
};

/**
 * @description This returns success response
 * @param  {Response} res
 * @param  {} data
 */
module.exports.createdResponse = (res, data = {}) => {
  return res.status(CREATED).json(data);
};

/**
 * @description This returns bad request with message string
 * @param  {Response} res
 * @param  {string} message
 */
module.exports.sendBadRequest = (res, message) => {
  return res.status(BADREQUEST).send(message);
};

/**
 * @description This returns notfound error with message string
 * @param  {Response} res
 * @param  {string} message
 */
module.exports.notFound = (res, message) => {
  return res.status(NOTFOUND).send(message);
};

/**
 * @description This returns server error with a default message
 * @param  {Response} res
 */
module.exports.serverError = (res) => {
  return res
    .status(INTERNALSERVERERROR)
    .send(
      "an error occurred, be rest assured that our team is looking into it"
    );
};

/**
 * @description This returns no content response
 * @param  {Response} res
 */
module.exports.sendNoContent = (res) => {
  return res.sendStatus(NOCONTENT);
};

/**
 * @description This returns not authorized response
 * @param  {Response} res
 */
module.exports.sendNotAuthorized = (res) => {
  return res.sendStatus(NOTAUTHORIZED);
};

/**
 * @description This returns not authorized response
 * @param  {Response} res
 */
module.exports.sendNotAllowed = (res) => {
  return res.sendStatus(FORBIDDEN);
};
