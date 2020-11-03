const logger = require("../../pkg/logger");
const { serverError } = require("../responses");

/**
 * @description This trys the handler and send an internal server error if anything goes wrong in the handler
 * @param  {Handler} handler
 */
module.exports.tryHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      logger.log("error", `internal server error occurred ${error.stack}`);
      return serverError(res);
    }
  };
};
