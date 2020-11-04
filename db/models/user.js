const { Schema, model } = require("mongoose");
const { hashPassword, compassPassword } = require("../../pkg/password");

const userSchema = new Schema({
  name: {
    type: String,
  },

  lastname: {
    type: String,
  },

  username: {
    type: String,
    unique: true,
    index: true,
  },

  password: {
    type: String,
  },

  age: {
    type: Number,
  },

  role: {
    type: String,
    default: "client",
  },
});

// Before user save hook
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  hashPassword(user.password)
    .then((passwordHash) => {
      user.password = passwordHash;
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      next();
    });
});

/**
 * @description This will compare if the password entered is the same with the
 * password hash in database with the bcryptjs library
 * @param  {string} password - password entered by user
 * @returns {Promise<boolean>}
 */
userSchema.methods.isMatchPassword = function (password) {
  return compassPassword(this.password, password);
};

module.exports = model("User", userSchema);
