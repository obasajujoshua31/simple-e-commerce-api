const bcrypt = require("bcryptjs");

const SALT = 10; //Password Salt for bcrypt

/**
 * @description This will generate hash for a password
 * @param  {string} password - password to be hashed
 * @returns Promise<string> - Promise of password hash or rejects with error
 */
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

/**
 * @description This will compare database password hash with the password in string entered by user.
 * @param  {string} dbHash - database password hash
 * @param  {string} userPassword - password entered by user
 * @returns Promise<boolean> - Promise of either true or false
 */
module.exports.compassPassword = (dbHash, userPassword) => {
  return bcrypt.compare(userPassword, dbHash);
};
