const logger = require("../../pkg/logger");
const { serverError } = require("../responses");

/**
 * @description This trys the handler and send an internal server error if anything goes wrong in the handler
 * @param  {Function} handler
 */
module.exports.tryHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.log("error", `internal server error occurred ${error.stack}`);
      return serverError(res);
    }
  };
};

/**
 * @description This takes request object and returns limit and offset for that request
 * it uses 1 for page and 5 for limit if not query params are passed
 *
 * @param {Request} req - request object
 */
module.exports.requestPaginationQuery = (req) => {
  let { limit = 5, page = 1 } = req.query;

  if (Number(limit) < 1) {
    limit = 5;
  }

  if (Number(page) < 1) {
    page = 1;
  }

  const offset = Number(limit) * (Number(page) - 1);
  return { offset, limit: Number(limit) };
};

/**
 * @description This accepts the request object and the total count of the documents
 * it returns the previous page, next page and the total count that was initially passed.
 *
 * @param {Request} req - request object
 * @param {number} totalCount - total record count found
 */
module.exports.paginationOption = (req, totalCount) => {
  const next = {};
  const previous = {};

  let { limit = 5, page = 1 } = req.query;

  if (Number(limit) < 1) {
    limit = 5;
  }

  if (Number(page) < 1) {
    page = 1;
  }

  if (Number(page) * Number(limit) < totalCount) {
    next.page = Number(page) + 1;
    next.limit = Number(limit);
  }

  if (page > 1) {
    previous.page = Number(page) - 1;
    previous.limit = Number(limit);
  }

  return { next, previous, totalCount };
};
