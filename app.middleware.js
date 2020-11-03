const express = require("express");
const logger = require("morgan");
const compression = require("compression");
// const appLogger = require("./pkg/logger");
const cors = require("cors");
// const { NOTACCEPTED } = require("./api/constants");

/**
 * @description This initialize the application middlewares.
 * @param  {express.Application} app
 */
const initAppMiddlewares = (app) => {
  app.use(compression());
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(logger("dev"));
};

/**
 * @description This handles all requests that the corresponding handler cannot be found.
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
module.exports.handleNotFound = (req, res, next) => {
  //   appLogger.log(
  //     "warn",
  //     `method not implemented at ${req.originalUrl}, method: ${req.method}`
  //   );
  res.sendStatus(406);
  return next();
};

module.exports.initAppMiddlewares = initAppMiddlewares;
