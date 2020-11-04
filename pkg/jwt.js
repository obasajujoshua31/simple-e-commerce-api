const jwt = require("jsonwebtoken");
const { Document: MongoDocument } = require("mongoose");
const { jwtSecret } = require("../config/config");

/**
 * @description This will sign the mongo document filtering out password and __v
 * @param  {MongoDocument} param
 * @returns string
 */
module.exports.generateToken = ({ password, __v, ...rest }) => {
  const token = jwt.sign({ ...rest }, jwtSecret, { expiresIn: "24h" });

  return token;
};

/**
 * @description This decodes token and returns corresponding decoded token
 * @param  {string} token
 * @returns object
 */
module.exports.decodeToken = (token) => {
  return jwt.verify(token, jwtSecret);
};
