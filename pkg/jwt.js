const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports.generateToken = ({ password, __v, ...rest }) => {
  const token = jwt.sign({ ...rest }, config.jwtSecret, { expiresIn: "24h" });

  return token;
};

module.exports.decodeToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
