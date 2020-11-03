const bcrypt = require("bcryptjs");

const SALT = 10;

module.exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT, (err, string) => {
      if (err) {
        reject(err);
      }
      resolve(string);
    });
  });
};

module.exports.compassPassword = (dbHash, userPassword) => {
  return bcrypt.compare(userPassword, dbHash);
};
